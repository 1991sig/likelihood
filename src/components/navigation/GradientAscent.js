import React, { useContext } from "react";
import Typography from "@material-ui/core/Typography";
import { VizDispatch } from "../../App";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import ReplayIcon from "@material-ui/icons/Replay";
import Tooltip from "@material-ui/core/Tooltip";
import { useSpring, animated, interpolate } from 'react-spring'
import { newtonStep } from "../utils";


const Counter = ({current, next}) => {
  const count = useSpring({from: {value: 0}, to: {value: 100}});

  return (
    <animated.div>
      {count.value.interpolate(x => x * 10)}
    </animated.div>
  )
}



const GradientAscent = ({ count, converged, mu, muHat, sigma2, sample }) => {
  const dispatch = useContext(VizDispatch);
  const iterate = (sample, mu, muHat, sigma2) => {

    const next = newtonStep(sample, mu, muHat, sigma2);
    dispatch({
      name: "gradientAscent",
      value: {
        increment: 1,
        update: next
      }
    })
  }
  return (
    <div>
      <Typography variant="body1">
        For more challenging models, we often need to use some{" "}
        <b>optimization algorithm</b>. Basically, we let the computer
        iteratively climb towards the top of the hill. The simplest algorithm is
        probably{" "}
        <a href="https://en.wikipedia.org/wiki/Gradient_descent">
          gradient ascent
        </a>{" "}
        (or descent if we look for the minima). You can use the controls below
        to see how a gradient ascent algorithm finds it's way to the maximum
        likelihood estimate.
      </Typography>
      <Typography display="inline" variant="body2">
        Gradient ascent
      </Typography>
      <Tooltip title={converged ? "" : "Run until convergence"}>
        <IconButton
          onClick={() =>
            dispatch({
              name: "runGradientAscent",
              value: { delay: 16 }
            })
          }
          aria-label="run gradient ascent"
          disabled={converged}
        >
          <PlayCircleFilledIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={converged ? "" : "1 iteration"}>
        <IconButton
          onClick={() => iterate(sample, mu, muHat, sigma2)}
          aria-label="iterate 1 gradient ascent"
          disabled={converged}
        >
          +1
        </IconButton>
      </Tooltip>
      <Tooltip title={converged ? "" : "10 iterations"}>
        <IconButton
          onClick={() =>
            dispatch({
              name: "gradientAscent",
              value: { increment: 10 }
            })
          }
          aria-label="iterate 10 gradient ascent"
          disabled={converged}
        >
          +10
        </IconButton>
      </Tooltip>
      <Tooltip title={!converged ? "" : "Reset"}>
        <IconButton
          onClick={() =>
            dispatch({
              name: "resetGradientAscent",
              value: null
            })
          }
          aria-label="reset gradient ascent"
          disabled={!converged}
        >
          <ReplayIcon />
        </IconButton>
      </Tooltip>
      <Typography display="inline" variant="body2">
        Iterations: {count} {converged && "(converged)"}
      </Typography>
      <Counter current={0} next={10} />
 
    </div>
  );
};

export default GradientAscent;
