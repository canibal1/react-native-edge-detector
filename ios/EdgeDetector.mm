#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(EdgeDetector, NSObject)

RCT_EXTERN_METHOD(openEdgeDetector)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
