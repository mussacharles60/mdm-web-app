import React from "react";
import "./index.css";
import * as faceapi from "face-api.js";
// import Webcam from "react-webcam";
import fs from "fs";

const MODEL_URL = "/android_asset/www/models";

declare global {
  interface Window {
    FB: any;
  }
}

let FB = window.FB; // ok now

export default class Main extends React.Component<
  {},
  {
    session_id: string | null;
    user_id: string | null;
    input_image: string;

    is_initializing: boolean;
    is_running_process: boolean;
  }
> {
  private didMount: boolean = false;
  constructor(props: any) {
    super(props);

    this.state = {
      session_id: null,
      user_id: null,
      input_image: "",
      is_initializing: true,
      is_running_process: false,
    };

    // this.onSessionIdChanged = this.onSessionIdChanged.bind(this);
    // this.onStartSessionBtnClick = this.onStartSessionBtnClick.bind(this);
    // this.onStopSessionBtnClick = this.onStopSessionBtnClick.bind(this);
  }

  async componentDidMount() {
    this.didMount = true;
    (window as any).MdmAndroid.onInitializationBegin();
    await this.loadModels();
    console.log(faceapi.nets);
    this.setState({ is_initializing: false });
    (window as any).MdmAndroid.onInitializationCompleted();
  }

  componentWillUnmount() {
    this.didMount = false;
  }

  async loadModels() {
    // faceapi.env.monkeyPatch({
    //     readFile: () => fs.readFile(MODEL_URL)
    //   })

    faceapi.env.monkeyPatch({
      readFile: (filePath: string) =>
        new Promise((resolve, reject) => {
          fs.readFile(filePath, (err, data) => {
            if (err) {
              console.log(err);
              reject(err);
              return;
            }
            resolve(data);
          });
          // (window as any).resolveLocalFileSystemURL(
          //   filePath,
          //   function (fileEntry: any) {
          //     fileEntry.file(
          //       function (file: any) {
          //         var reader = new FileReader();

          //         let fileExtension = filePath.split("?")[0].split(".").pop();
          //         if (fileExtension === "json") {
          //           reader.onloadend = function () {
          //             resolve(this.result);
          //           };
          //           reader.readAsText(file);
          //         } else {
          //           reader.onloadend = function () {
          //             resolve(new Uint8Array(this.result));
          //           };

          //           reader.readAsArrayBuffer(file);
          //         }
          //       },
          //       function () {
          //         resolve(false);
          //       }
          //     );
          //   },
          //   function () {
          //     resolve(false);
          //   }
          // );
        }),
      Canvas: HTMLCanvasElement,
      Image: HTMLImageElement,
      ImageData: ImageData,
      Video: HTMLVideoElement,
      createCanvasElement: () => document.createElement("canvas"),
      createImageElement: () => document.createElement("img"),
    });

    return Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL),
      faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.ageGenderNet.loadFromDisk(MODEL_URL),
    ]);
  }

  render() {
    return <div className="mdm-main">Progress</div>;
  }
}
