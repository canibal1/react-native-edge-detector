
import UIKit


@objc(EdgeDetector)
class EdgeDetector: NSObject, UINavigationControllerDelegate, RCTBridgeModule{
    static func moduleName() -> String! {
        return "EdgeDetector"
    }
    var bridge: RCTBridge!

  @objc(openEdgeDetector)
  func openEdgeDetector() -> Void {
    
 
      DispatchQueue.main.async {
          let scannerViewController = ImageScannerController(delegate: self, enabledAutoCapture: true, scannerMode: .idCard)
          scannerViewController.modalPresentationStyle = .fullScreen
          scannerViewController.isModalInPresentation = true
          if let appDelegate = UIApplication.shared.delegate, let rootViewController = appDelegate.window??.rootViewController {
              rootViewController.present(scannerViewController, animated: true, completion: nil)
          }
        print("zamanke")
      }
  }
    
    func sendEvent(withName name: String, body: Any?) {
        bridge.eventDispatcher().sendAppEvent(withName: name, body: body)
    }
}
 
extension EdgeDetector: ImageScannerControllerDelegate {
 
    func imageScannerController(_ scanner: ImageScannerController, didFinishScanningWithResults results: ImageScannerResults) {
        print("koş geldll")
 
          
        sendEvent(withName: "onScanSuccess", body: ["data": results.croppedScan.image.pngData()?.base64EncodedString()])
        scanner.dismiss(animated: true)
        
    }
    
    func imageScannerControllerDidCancel(_ scanner: ImageScannerController) {
        scanner.dismiss(animated: true)
        print("canceled")
    }
    
    func imageScannerController(_ scanner: ImageScannerController, didFailWithError error: Error) {
        print("zamane",error.localizedDescription)
    }
}
