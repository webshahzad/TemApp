package com.capovela.tem.fit;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.CommonStatusCodes;
import com.google.android.gms.fitness.Fitness;
import com.google.android.gms.fitness.FitnessOptions;
import com.google.android.gms.fitness.data.DataType;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;

public class GoogleFitAuthorization implements ActivityEventListener {
    private static final int GOOGLE_FIT_PERMISSIONS_REQUEST_CODE = 111;
    private final FitnessOptions options;
    private final ReactApplicationContext context;
    private OnSuccessListener<Boolean> authorizationSuccess;

    public GoogleFitAuthorization(ReactApplicationContext context) {
        options = FitnessOptions.builder()
                .addDataType(DataType.AGGREGATE_DISTANCE_DELTA, FitnessOptions.ACCESS_READ)
                .addDataType(DataType.AGGREGATE_STEP_COUNT_DELTA, FitnessOptions.ACCESS_READ)
                .build();
        this.context = context;
        context.addActivityEventListener(this);
    }

    public boolean isAuthorized() {
        return GoogleSignIn.hasPermissions(getAccount(), options);
    }

    public void requestAuthorization(OnSuccessListener<Boolean> success) {
        if (!isAuthorized()) {
            authorizationSuccess = success;
            GoogleSignIn.requestPermissions(
                    context.getCurrentActivity(),
                    GOOGLE_FIT_PERMISSIONS_REQUEST_CODE,
                    getAccount(),
                    options);
        } else {
            success.onSuccess(true);
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == GOOGLE_FIT_PERMISSIONS_REQUEST_CODE) {
            if (resultCode == Activity.RESULT_OK) {
                authorizationSuccess.onSuccess(true);
            } else if (resultCode == Activity.RESULT_CANCELED) {
                authorizationSuccess.onSuccess(false);
            }
            authorizationSuccess = null;
        }
    }

    public void disconnect(OnSuccessListener<Void> success, OnFailureListener failure) {
        Fitness.getConfigClient(context.getCurrentActivity(), getAccount()).disableFit()
                .addOnSuccessListener(res -> {
                    GoogleSignInOptions signInOptions = new GoogleSignInOptions.Builder().addExtension(options).build();
                    GoogleSignIn.getClient(context.getCurrentActivity(), signInOptions)
                            .revokeAccess()
                            .addOnSuccessListener(success)
                            .addOnFailureListener((Exception e) -> {
                                // https://github.com/android/fit-samples/issues/28#issuecomment-557865949
                                if (((ApiException) e).getStatusCode() == CommonStatusCodes.SIGN_IN_REQUIRED)
                                    success.onSuccess(null);
                                else
                                    failure.onFailure(e);
                            });
                })
                .addOnFailureListener(failure);
    }

    public GoogleSignInAccount getAccount() {
        return GoogleSignIn.getAccountForExtension(context.getApplicationContext(), options);
    }

    @Override
    public void onNewIntent(Intent intent) {
    }
}
