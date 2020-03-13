import React, { useEffect, useRef } from "react";
import { useSpring, animated, interpolate, useChain } from "react-spring";
import { range } from "d3-array";
import { logLikSum, quadraticApprox } from "../utils";

const AnimatedPath = ({
  mu,
  sigma2,
  yMin,
  yMax,
  xMin,
  xScale,
  yScale,
  linex,
  llTheta,
  deriv,
  hessian
}) => {


  const props = useSpring({
    from: { opacity: 0, offset: 1000 },
    to: { opacity: 1, offset: 0 },
    reset: true,
    config: { duration: 500 },
  });

  const x_range = range(yMin, yMax, Math.abs(yMax - yMin) / 50);
  const newtonParabola = x_range.map(x1 => {
    return [x1, quadraticApprox(x1 - sigma2, 1, llTheta, deriv, hessian)];
  });

  const x1 = sigma2 + deriv / -hessian;

  const x1ApproxLL = quadraticApprox(x1 - sigma2, 1, llTheta, deriv, hessian);

  return (
    <g>
      <animated.path
        d={linex(newtonParabola)}
        className="LogLikNewton--test"
        strokeDasharray={1000}
        strokeDashoffset={props.offset}
      />
      <animated.g style={{ opacity: props.opacity }}>
        <line
          className="LogLikNewton--maxima"
          x1={xScale(xMin)}
          x2={xScale(x1ApproxLL)}
          y1={yScale(x1)}
          y2={yScale(x1)}
        />
        <circle
          cx={xScale(x1ApproxLL)}
          cy={yScale(x1)}
          r="5"
          className="logLikNewtonX--approx"
        />
      </animated.g>
    </g>
  );
};
export default AnimatedPath;
