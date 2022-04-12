//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { Address } from "models/data/Address";
import { standalone, Transaction, transaction } from "reactronic";
import Geolocation, {
  GeoOptions,
  GeoPosition,
} from "react-native-geolocation-service";
import { PermissionsAndroid } from "react-native";

export interface LocationMatch {
  length: number;
  offset: number;
}

export interface LocationTerm {
  value: string;
  offset: number;
}

export interface LocationPlacement {
  lat: number;
  lng: number;
}

export interface LocationInfo {
  id: string;
  place_id: string;
  description: string;
  matched_substrings: LocationMatch[];
  terms: LocationTerm[];
}

export interface PlaceInfo {
  id: string;
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: LocationPlacement;
  };
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface PlaceDetails {
  address_components: AddressComponent[];
  formatted_address: string;
  place_id: string;
  geometry: {
    location: LocationPlacement;
  };
}

export class LocationManager {
  private readonly apiKey = "AIzaSyBsIg57VjRz6OIj1qYwZXZwi6IQEqOARK8";

  constructor() {}

  async getCurrentPlacement(): Promise<LocationPlacement> {
    const geolocation = await this.getCurrentGeolocation();
    console.log("geolocation......>>", geolocation);
    // return {
    //   lat: geolocation.coords.latitude,
    //   lng: geolocation.coords.longitude,
    // }
    return {
      lat: geolocation.coords.latitude,
      lng: geolocation.coords.longitude,
    };
  }

  async getCurrentGeolocation(options?: GeoOptions): Promise<GeoPosition> {
    await PermissionsAndroid.request("android.permission.ACCESS_FINE_LOCATION");
    return new Promise<GeoPosition>((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          reject(error);
        },
        {
          ...options,
          enableHighAccuracy: true,
          timeout: 20000,
        }
      );
    });
  }

  async getCurrentLocation(): Promise<Address | undefined> {
    let result = undefined;
    try {
      const placement = await this.getCurrentPlacement();
      // const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${placement.lat},${placement.lng}&radius=100&type=locality&key=${this.apiKey}`
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?location=${placement.lat},${placement.lng}&raduis=50000&type=restaurant&key=${this.apiKey}`;
      const response = await fetch(url);
      const jsonResult = await response.json();

      const places: PlaceInfo[] = (jsonResult as any).results;
      if (places.length) {
        const details = await this.getPlaceDetails(places[0].place_id);
        result = this.getPlaceAddress(details);
      }
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  async findLocations(filter: string): Promise<LocationInfo[]> {
    let result: LocationInfo[] = [];
    try {
      const encodedFilter = encodeURIComponent(filter);
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodedFilter}&key=${this.apiKey}&types=(cities)`;
      const response = await fetch(url);
      const jsonResult = await response.json();
      result = (jsonResult as any).predictions;
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  @transaction
  async getLocationAddress(location: LocationInfo): Promise<Address> {
    const address = standalone(() => Transaction.run(() => new Address()));
    try {
      address.address = location.description;
      address.place_id = location.place_id;
      this.parseLocationTerms(location.terms, address);

      const details = await this.getPlaceDetails(location.place_id);
      const placement = details.geometry.location;
      address.lat = placement.lat;
      address.lng = placement.lng;
    } catch (e) {
      console.log(e);
    }
    return address;
  }

  async findGyms(
    filter: string,
    placement: LocationPlacement
  ): Promise<PlaceInfo[]> {
    return this.findPlaces(filter, placement, "gym");
  }

  async findPlaces(
    filter: string,
    placement: LocationPlacement,
    type?: string
  ): Promise<PlaceInfo[]> {
    let result: PlaceInfo[] = [];
    try {
      const typePattern = type ? type + "+" : "";
      const encodedFilter = encodeURIComponent(filter);
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${typePattern}${encodedFilter}&location=${placement.lat},${placement.lng}&radius=10000&key=${this.apiKey}`;
      const response = await fetch(url);
      const jsonResult = await response.json();
      result = (jsonResult as any).results;
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  @transaction
  getGymAddress(gym: PlaceInfo): Address {
    const address = standalone(() => Transaction.run(() => new Address()));
    address.address = gym.formatted_address;
    address.place_id = gym.place_id;
    address.name = gym.name;
    address.lat = gym.geometry.location.lat;
    address.lng = gym.geometry.location.lng;
    return address;
  }

  private parseLocationTerms(terms: LocationTerm[], output: Address): void {
    if (terms.length > 0) {
      if (terms.length === 1) {
        output.country = terms[0].value;
      } else {
        output.city = terms[0].value;
        if (terms.length === 2) {
          output.country = terms[1].value;
        } else {
          output.state = terms[1].value;
          output.country = terms[2].value;
        }
      }
    }
  }

  private async getPlaceDetails(id: string): Promise<PlaceDetails> {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${id}&key=${this.apiKey}`;
    const response = await fetch(url);
    const jsonResult = await response.json();
    return (jsonResult as any).result;
  }

  private getPlaceAddress(details: PlaceDetails): Address {
    const address = standalone(() => Transaction.run(() => new Address()));
    address.address = details.formatted_address;
    address.place_id = details.place_id;
    for (const component of details.address_components) {
      if (component.types.indexOf("locality") !== -1) {
        address.city = component.long_name;
      } else if (
        component.types.indexOf("administrative_area_level_1") !== -1
      ) {
        address.state = component.long_name;
      } else if (component.types.indexOf("country") !== -1) {
        address.country = component.long_name;
      }
    }
    const placement = details.geometry.location;
    address.lat = placement.lat;
    address.lng = placement.lng;
    return address;
  }
}
