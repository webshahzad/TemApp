import { NativeModules } from 'react-native'

const { GoogleFit: nativeModule } = NativeModules

class RNGoogleFitModule {

  async isAuthorized(): Promise<boolean> {
    const result = await nativeModule.isAuthorized()
    return result
  }

  async authorize(): Promise<boolean> {
    const result = await nativeModule.authorize()
    return result
  }

  async disconnect(): Promise<void> {
    await nativeModule.disconnect()
  }

  async getActivities(start: number, end: number): Promise<RNGoogleFitActivity[]> {
    const result = await nativeModule.getActivities(start, end) as RNGoogleFitActivity[]
    return result
  }
}

export const RNGoogleFit = new RNGoogleFitModule()

export interface RNGoogleFitActivity {
  type: RNGoogleFitActivityType
  start: number
  end: number
  distance: number
  steps: number
}

export enum RNGoogleFitActivityType {
  AEROBICS = 'aerobics',
  ARCHERY = 'archery',
  BADMINTON = 'badminton',
  BASEBALL = 'baseball',
  BASKETBALL = 'basketball',
  BIATHLON = 'biathlon',
  BIKING = 'biking',
  BIKING_HAND = 'biking.hand',
  BIKING_MOUNTAIN = 'biking.mountain',
  BIKING_ROAD = 'biking.road',
  BIKING_SPINNING = 'biking.spinning',
  BIKING_STATIONARY = 'biking.stationary',
  BIKING_UTILITY = 'biking.utility',
  BOXING = 'boxing',
  CALISTHENICS = 'calisthenics',
  CIRCUIT_TRAINING = 'circuit_training',
  CRICKET = 'cricket',
  CROSSFIT = 'crossfit',
  CURLING = 'curling',
  DANCING = 'dancing',
  DIVING = 'diving',
  ELEVATOR = 'elevator',
  ELLIPTICAL = 'elliptical',
  ERGOMETER = 'ergometer',
  ESCALATOR = 'escalator',
  FENCING = 'fencing',
  FOOTBALL_AMERICAN = 'football.american',
  FOOTBALL_AUSTRALIAN = 'football.australian',
  FOOTBALL_SOCCER = 'football.soccer',
  FRISBEE_DISC = 'frisbee_disc',
  GARDENING = 'gardening',
  GOLF = 'golf',
  GUIDED_BREATHING = 'guided_breathing',
  GYMNASTICS = 'gymnastics',
  HANDBALL = 'handball',
  HIGH_INTENSITY_INTERVAL_TRAINING = 'interval_training.high_intensity',
  HIKING = 'hiking',
  HOCKEY = 'hockey',
  HORSEBACK_RIDING = 'horseback_riding',
  HOUSEWORK = 'housework',
  ICE_SKATING = 'ice_skating',
  IN_VEHICLE = 'in_vehicle',
  INTERVAL_TRAINING = 'interval_training',
  JUMP_ROPE = 'jump_rope',
  KAYAKING = 'kayaking',
  KETTLEBELL_TRAINING = 'kettlebell_training',
  KICK_SCOOTER = 'kick_scooter',
  KICKBOXING = 'kickboxing',
  KITESURFING = 'kitesurfing',
  MARTIAL_ARTS = 'martial_arts',
  MEDITATION = 'meditation',
  MIXED_MARTIAL_ARTS = 'martial_arts.mixed',
  ON_FOOT = 'on_foot',
  OTHER = 'other',
  P90X = 'p90x',
  PARAGLIDING = 'paragliding',
  PILATES = 'pilates',
  POLO = 'polo',
  RACQUETBALL = 'racquetball',
  ROCK_CLIMBING = 'rock_climbing',
  ROWING = 'rowing',
  ROWING_MACHINE = 'rowing.machine',
  RUGBY = 'rugby',
  RUNNING = 'running',
  RUNNING_JOGGING = 'running.jogging',
  RUNNING_SAND = 'running.sand',
  RUNNING_TREADMILL = 'running.treadmill',
  SAILING = 'sailing',
  SCUBA_DIVING = 'scuba_diving',
  SKATEBOARDING = 'skateboarding',
  SKATING = 'skating',
  SKATING_CROSS = 'skating.cross',
  SKATING_INDOOR = 'skating.indoor',
  SKATING_INLINE = 'skating.inline',
  SKIING = 'skiing',
  SKIING_BACK_COUNTRY = 'skiing.back_country',
  SKIING_CROSS_COUNTRY = 'skiing.cross_country',
  SKIING_DOWNHILL = 'skiing.downhill',
  SKIING_KITE = 'skiing.kite',
  SKIING_ROLLER = 'skiing.roller',
  SLEDDING = 'sledding',
  SLEEP = 'sleep',
  SLEEP_LIGHT = 'sleep.light',
  SLEEP_DEEP = 'sleep.deep',
  SLEEP_REM = 'sleep.rem',
  SLEEP_AWAKE = 'sleep.awake',
  SNOWBOARDING = 'snowboarding',
  SNOWMOBILE = 'snowmobile',
  SNOWSHOEING = 'snowshoeing',
  SOFTBALL = 'softball',
  SQUASH = 'squash',
  STAIR_CLIMBING = 'stair_climbing',
  STAIR_CLIMBING_MACHINE = 'stair_climbing.machine',
  STANDUP_PADDLEBOARDING = 'standup_paddleboarding',
  STILL = 'still',
  STRENGTH_TRAINING = 'strength_training',
  SURFING = 'surfing',
  SWIMMING = 'swimming',
  SWIMMING_POOL = 'swimming.pool',
  SWIMMING_OPEN_WATER = 'swimming.open_water',
  TABLE_TENNIS = 'table_tennis',
  TEAM_SPORTS = 'team_sports',
  TENNIS = 'tennis',
  TILTING = 'tilting',
  TREADMILL = 'treadmill',
  UNKNOWN = 'unknown',
  VOLLEYBALL = 'volleyball',
  VOLLEYBALL_BEACH = 'volleyball.beach',
  VOLLEYBALL_INDOOR = 'volleyball.indoor',
  WAKEBOARDING = 'wakeboarding',
  WALKING = 'walking',
  WALKING_FITNESS = 'walking.fitness',
  WALKING_NORDIC = 'walking.nordic',
  WALKING_TREADMILL = 'walking.treadmill',
  WALKING_STROLLER = 'walking.stroller',
  WATER_POLO = 'water_polo',
  WEIGHTLIFTING = 'weightlifting',
  WHEELCHAIR = 'wheelchair',
  WINDSURFING = 'windsurfing',
  YOGA = 'yoga',
  ZUMBA = 'zumba',
}
