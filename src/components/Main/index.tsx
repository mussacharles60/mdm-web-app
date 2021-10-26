import React from "react";
import "./index.css";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
// import fs from "fs";

// const MODEL_URL = "/android_asset/www/models";
const MODEL_URL = "/models";

export default class Main extends React.Component<
  {},
  {
    session_id: string | null;
    user_id: string | null;
    input_image: string;

    is_initializing: boolean;
    is_running_process: boolean;
    has_media_stream: boolean;
    show_canvas: boolean;
    // videoWidth: number;
    // videoHeight: number;
  }
> {
  private didMount: boolean = false;
  private webcam: React.RefObject<Webcam> = React.createRef<Webcam>();
  private mainView: React.RefObject<HTMLDivElement> =
    React.createRef<HTMLDivElement>();

  private canvas1: React.RefObject<HTMLCanvasElement> =
    React.createRef<HTMLCanvasElement>();
  private canvas2: React.RefObject<HTMLCanvasElement> =
    React.createRef<HTMLCanvasElement>();

  constructor(props: any) {
    super(props);

    this.state = {
      session_id: null,
      user_id: null,
      input_image: "",
      is_initializing: true,
      is_running_process: false,
      has_media_stream: false,
      show_canvas: false,
      // videoWidth: 200,
      // videoHeight: 700,
    };

    this.capture = this.capture.bind(this);
    // this.onStartSessionBtnClick = this.onStartSessionBtnClick.bind(this);
    // this.onStopSessionBtnClick = this.onStopSessionBtnClick.bind(this);
  }

  async componentDidMount() {
    this.didMount = true;
    if (this.mainView && this.mainView.current) {
      // const imageSrc = this.webcam.current.getScreenshot();
      // this.setState({
      //   videoWidth: this.mainView.current.getBoundingClientRect().width,
      //   videoHeight: this.mainView.current.getBoundingClientRect().height,
      // });
    }
    try {
      (window as any).MdmAndroid.onInitializationBegin();
    } catch (e) {
      console.log(e);
    }
    await this.loadModels();
    // console.log(faceapi.nets);
    this.setState({ is_initializing: false });
    try {
      (window as any).MdmAndroid.onInitializationCompleted();
    } catch (e) {
      console.log(e);
    }
  }

  componentWillUnmount() {
    this.didMount = false;
  }

  async loadModels() {
    // faceapi.env.monkeyPatch({
    //     readFile: () => fs.readFile(MODEL_URL)
    //   })

    // faceapi.env.monkeyPatch({
    //   readFile: (filePath: string) =>
    //     new Promise((resolve, reject) => {
    //       resolve(Buffer.from(filePath, 'base64'))
    //       // fs.readFile(filePath, (err, data) => {
    //       //   // if (err) {
    //       //   //   console.log(err);
    //       //   //   reject(err);
    //       //   //   return;
    //       //   // }
    //       //   resolve(data);
    //       // });
    //       // (window as any).resolveLocalFileSystemURL(
    //       //   filePath,
    //       //   function (fileEntry: any) {
    //       //     fileEntry.file(
    //       //       function (file: any) {
    //       //         var reader = new FileReader();

    //       //         let fileExtension = filePath.split("?")[0].split(".").pop();
    //       //         if (fileExtension === "json") {
    //       //           reader.onloadend = function () {
    //       //             resolve(this.result);
    //       //           };
    //       //           reader.readAsText(file);
    //       //         } else {
    //       //           reader.onloadend = function () {
    //       //             resolve(new Uint8Array(this.result));
    //       //           };

    //       //           reader.readAsArrayBuffer(file);
    //       //         }
    //       //       },
    //       //       function () {
    //       //         resolve(false);
    //       //       }
    //       //     );
    //       //   },
    //       //   function () {
    //       //     resolve(false);
    //       //   }
    //       // );
    //     }),
    //   // Canvas: HTMLCanvasElement,
    //   // Image: HTMLImageElement,
    //   // ImageData: ImageData,
    //   // Video: HTMLVideoElement,
    //   // createCanvasElement: () => document.createElement("canvas"),
    //   // createImageElement: () => document.createElement("img"),
    // });

    return Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
    ]);
  }

  private async capture() {
    const mtcnnParams: any = {
      // number of scaled versions of the input image passed through the CNN
      // of the first stage, lower numbers will result in lower inference time,
      // but will also be less accurate
      maxNumScales: 10,
      // scale factor used to calculate the scale steps of the image
      // pyramid used in stage 1
      scaleFactor: 0.709,
      // the score threshold values used to filter the bounding
      // boxes of stage 1, 2 and 3
      scoreThresholds: [0.6, 0.7, 0.7],
      // mininum face size to expect, the higher the faster processing will be,
      // but smaller faces won't be detected
      minFaceSize: 20,
    };
    const videoInput = document.getElementById("video-input");
    if (this.webcam && this.webcam.current && videoInput) {
      // const imageSrc = this.webcam.current.getScreenshot();

      const mtcnnResults = await faceapi.mtcnn(
        videoInput as any,
        mtcnnParams
        //    {
        //   minFaceSize: 20,
        //   scaleFactor: 0.709,
        //   maxNumScales: 10,
        //   scoreThresholds: [0.6, 0.7, 0.7],
        // }
      );

      console.log(mtcnnResults);

      // minFaceSize?: number;
      // scaleFactor?: number;
      // maxNumScales?: number;
      // scoreThresholds?: number[];
      // scaleSteps?: number[];
    }
  }

  render() {
    return (
      <div className="mdm-main" ref={this.mainView}>
        <div className="webcam-cont">
          {!this.state.is_initializing && (
            <Webcam
              className="webcam-view"
              id={"video-input"}
              audio={false}
              mirrored={true}
              width={"100%"}
              height={"100%"}
              ref={this.webcam}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                // width: this.state.videoWidth,
                // height: this.state.videoHeight,
                facingMode: "user",
              }}
              onUserMedia={() => {
                setTimeout(() => {
                  if (!this.didMount) return;
                  this.setState({ has_media_stream: true });
                  try {
                    (window as any).MdmAndroid.onCameraReady();
                  } catch (error) {
                    console.log(error);
                  }
                }, 1000);
                this.capture();
              }}
              onUserMediaError={() => {
                setTimeout(() => {
                  if (!this.didMount) return;
                  this.setState({ has_media_stream: false });
                  try {
                    (window as any).MdmAndroid.onCameraFailed();
                  } catch (error) {
                    console.log(error);
                  }
                }, 1000);
              }}
            />
          )}
          <div
            className="image-frame"
            style={{ display: this.state.show_canvas ? "flex" : "none" }}
          >
            <canvas className="canvas" ref={this.canvas1} />
            <canvas className="canvas canvas-output" ref={this.canvas2} />
          </div>
          {this.state.is_initializing && !this.state.has_media_stream && (
            <div className="lazy-load-view">
              <i
                className="las la-spinner la-spin progress-icon"
                // style={{
                //   display: this.state.is_initializing ? "flex" : "none",
                // }}
              ></i>
            </div>
          )}
        </div>
      </div>
    );
  }
}
