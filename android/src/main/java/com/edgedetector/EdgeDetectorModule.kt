package com.edgedetector


import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.util.Log
import com.edgedetector.scan.ScanActivity
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise


class EdgeDetectorModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {
  private var result: Promise? = null
  override fun getName(): String {
    return NAME
  }


  private val activityEventListener =
    object : BaseActivityEventListener() {
      override fun onActivityResult(
        activity: Activity?,
        requestCode: Int,
        resultCode: Int,
        intent: Intent?
      ) {

        if (requestCode == REQUEST_CODE) {
          when (resultCode) {
            Activity.RESULT_OK -> {

              finishWithSuccess(true)
            }

            Activity.RESULT_CANCELED -> {
              finishWithSuccess(false)
            }

            ERROR_CODE -> {
              finishWithError(ERROR_CODE.toString(), intent?.getStringExtra("RESULT") ?: "ERROR")
            }
          }

        }

      }
    }

  init {
    reactContext.addActivityEventListener(activityEventListener)
  }

  @SuppressLint("QueryPermissionsNeeded")
  @ReactMethod
  private fun openEdgeDetector(
    saveTo: String,
    scanTitle: String,
    cropTitle: String,
    cropBlackWhiteTitle: String,
    cropResetTitle: String,
    result: Promise
  ) {


    Log.e(
      "daraaaa",
      saveTo
        + "_" + scanTitle
        + "_" + cropTitle
        + "_" + cropBlackWhiteTitle
        + "_" + cropResetTitle
    )
    if (!setPendingMethodCallAndResult(result)) {
      finishWithAlreadyActiveError()
      return
    }
    val intent = Intent(reactApplicationContext, ScanActivity::class.java)

    if (intent.resolveActivity(reactApplicationContext.packageManager) != null) {
      val bundle = Bundle()
      bundle.putString(SAVE_TO, saveTo)
      bundle.putString(SCAN_TITLE, scanTitle)
      bundle.putString(CROP_TITLE, cropTitle)
      bundle.putString(CROP_BLACK_WHITE_TITLE, cropBlackWhiteTitle)
      bundle.putString(CROP_RESET_TITLE, cropResetTitle)
      bundle.putBoolean(CAN_USE_GALLERY, false)
      intent.putExtra(INITIAL_BUNDLE, bundle)
      reactApplicationContext.currentActivity?.startActivityForResult(intent, REQUEST_CODE)
    }


  }

  private fun setPendingMethodCallAndResult(
    result: Promise
  ): Boolean {
    if (this.result != null) {
      return false
    }
    this.result = result
    return true
  }


  private fun finishWithAlreadyActiveError() {
    finishWithError("already_active", "Edge detection is already active")
  }

  private fun finishWithError(errorCode: String, errorMessage: String) {

    result?.reject(errorMessage, Exception("errorCode: $errorCode, errorMessage:$errorMessage"))
    clearMethodCallAndResult()
  }

  private fun finishWithSuccess(res: Boolean) {
    result?.resolve(res)
    clearMethodCallAndResult()
  }

  private fun clearMethodCallAndResult() {
    result = null
  }

  companion object {
    const val NAME = "EdgeDetector"
    const val INITIAL_BUNDLE = "initial_bundle"
    const val FROM_GALLERY = "from_gallery"
    const val SAVE_TO = "save_to"
    const val CAN_USE_GALLERY = "can_use_gallery"
    const val SCAN_TITLE = "scan_title"
    const val CROP_TITLE = "crop_title"
    const val CROP_BLACK_WHITE_TITLE = "crop_black_white_title"
    const val CROP_RESET_TITLE = "crop_reset_title"
  }


}
