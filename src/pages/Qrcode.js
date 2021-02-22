import React from "react";
import { useQRCode } from "react-qrcodes";

function Qrcode(props) {
  var deviceId = props.deviceId;
  const [inputRef] = useQRCode({
    text: deviceId,
    options: {
      level: "M",
      margin: 7,
      scale: 1,
      width: 200,
      color: {
        dark: "#000",
        light: "#FFF",
      },
    },
  });

  return <canvas ref={inputRef} />;
}

export default Qrcode;
