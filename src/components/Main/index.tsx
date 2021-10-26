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
    videoWidth: number;
    videoHeight: number;
  }
> {
  private didMount: boolean = false;
  private webcam: React.RefObject<Webcam> = React.createRef<Webcam>();
  private mainView: React.RefObject<HTMLDivElement> =
    React.createRef<HTMLDivElement>();

  constructor(props: any) {
    super(props);

    this.state = {
      session_id: null,
      user_id: null,
      input_image: "",
      is_initializing: true,
      is_running_process: false,
      has_media_stream: false,
      videoWidth: 200,
      videoHeight: 700,
    };

    // this.onSessionIdChanged = this.onSessionIdChanged.bind(this);
    // this.onStartSessionBtnClick = this.onStartSessionBtnClick.bind(this);
    // this.onStopSessionBtnClick = this.onStopSessionBtnClick.bind(this);
  }

  async componentDidMount() {
    this.didMount = true;
    if (this.mainView && this.mainView.current) {
      // const imageSrc = this.webcam.current.getScreenshot();
      this.setState({
        videoWidth: this.mainView.current.getBoundingClientRect().width,
        videoHeight: this.mainView.current.getBoundingClientRect().height,
      });
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

  private capture(): void {
    if (this.webcam && this.webcam.current) {
      // const imageSrc = this.webcam.current.getScreenshot();
    }
  }

  render() {
    return (
      <div className="mdm-main" ref={this.mainView}>
        {/* <div>
          <i
            className="las la-spinner la-spin progress-icon"
            style={{
              display: this.state.is_initializing ? "flex" : "none",
            }}
          ></i>
        </div> */}
        <div className="webcam-cont">
          <Webcam
            className="webcam-view"
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
              this.setState({ has_media_stream: true });
            }}
            onUserMediaError={() => {
              this.setState({ has_media_stream: false });
            }}
          />
          {/* <button onClick={capture}>Capture photo</button> */}
          {/* <div className="image-frame">
            <canvas className="img-input" id="canvas" />
            <canvas className="img-input canvas-output" id="canvas-output" />
          </div> */}
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
