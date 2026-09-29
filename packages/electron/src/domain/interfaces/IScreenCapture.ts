// JARVIS - Screen Capture Domain Interface
export interface IScreenCapture {
  captureFullScreen(): Promise<Buffer>;
  captureWindow(windowId: string): Promise<Buffer>;
  captureRegion(x: number, y: number, width: number, height: number): Promise<Buffer>;
}
