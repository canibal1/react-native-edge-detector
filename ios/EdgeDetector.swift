
import UIKit

@objc(EdgeDetector)
class EdgeDetector: NSObject {

  @objc(multiply:withB:withResolver:withRejecter:)
  func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
      
      guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
             return
         }
      
      let scannerViewController = ImageScannerController(delegate: appDelegate.self)
             scannerViewController.modalPresentationStyle = appDelegate.window?.fullScreen

             if #available(iOS 13.0, *) {
                 scannerViewController.navigationBar.tintColor = appDelegate.window?.label
             } else {
                 scannerViewController.navigationBar.tintColor = appDelegate.window?.black
             }

             present(scannerViewController, animated: true)
  }
}
