package com.capovela.tem.fit;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.fitness.Fitness;
import com.google.android.gms.fitness.data.Bucket;
import com.google.android.gms.fitness.data.DataPoint;
import com.google.android.gms.fitness.data.DataType;
import com.google.android.gms.fitness.data.Field;
import com.google.android.gms.fitness.request.DataReadRequest;
import com.google.android.gms.fitness.result.DataReadResponse;

import java.util.List;
import java.util.concurrent.TimeUnit;

public class GoogleFitModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext context;
    private final GoogleFitAuthorization googleFitAuthorization;

    public GoogleFitModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
        googleFitAuthorization = new GoogleFitAuthorization(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "GoogleFit";
    }

    @ReactMethod
    public void isAuthorized(Promise promise) {
        boolean result = googleFitAuthorization.isAuthorized();
        promise.resolve(result);
    }

    @ReactMethod
    public void authorize(Promise promise) {
        googleFitAuthorization.requestAuthorization(promise::resolve);
    }

    @ReactMethod
    public void disconnect(Promise promise) {
        if (!googleFitAuthorization.isAuthorized()) {
            promise.resolve(null);
            return;
        }
        googleFitAuthorization.disconnect(promise::resolve, e -> promise.reject("SDK_ERROR", e));
    }

    @ReactMethod
    public void getActivities(double start, double end, Promise promise) {
        try {
            DataReadRequest request = new DataReadRequest.Builder()
                    .aggregate(DataType.AGGREGATE_DISTANCE_DELTA)
                    .aggregate(DataType.AGGREGATE_STEP_COUNT_DELTA)
                    .bucketByActivitySegment(1, TimeUnit.SECONDS)
                    .setTimeRange((long) start, (long) end, TimeUnit.MILLISECONDS)
                    .build();
            GoogleSignInAccount account = googleFitAuthorization.getAccount();
            Fitness.getHistoryClient(context.getApplicationContext(), account)
                    .readData(request)
                    .addOnSuccessListener(response -> promise.resolve(prepareActivitiesResponse(response)))
                    .addOnFailureListener(e -> promise.reject("SDK_ERROR", e));
        } catch (Exception e) {
            promise.reject("SDK_ERROR", e);
        }
    }

    private WritableArray prepareActivitiesResponse(DataReadResponse response) {
        WritableArray result = Arguments.createArray();
        for (Bucket bucket : response.getBuckets()) {
            String activity = bucket.getActivity();
            long start = bucket.getStartTime(TimeUnit.MILLISECONDS);
            long end = bucket.getEndTime(TimeUnit.MILLISECONDS);
            double distance = 0;
            List<DataPoint> dataPoints = bucket.getDataSet(DataType.AGGREGATE_DISTANCE_DELTA).getDataPoints();
            for (DataPoint point : dataPoints) {
                distance += point.getValue(Field.FIELD_DISTANCE).asFloat();
            }
            double steps = 0;
            dataPoints = bucket.getDataSet(DataType.AGGREGATE_STEP_COUNT_DELTA).getDataPoints();
            for (DataPoint point : dataPoints) {
                steps += point.getValue(Field.FIELD_STEPS).asInt();
            }
            WritableMap bucketResult = Arguments.createMap();
            bucketResult.putString("type", activity);
            bucketResult.putDouble("start", start);
            bucketResult.putDouble("end", end);
            bucketResult.putDouble("distance", distance);
            bucketResult.putDouble("steps", steps);
            result.pushMap(bucketResult);
        }
        return result;
    }
}
