import Countdown from "react-countdown";
export default function CountDownDate({ time, styleRender }) {
  return (
    <Countdown
      date={Date.now() + time}
      renderer={styleRender}
    />
  );
}
