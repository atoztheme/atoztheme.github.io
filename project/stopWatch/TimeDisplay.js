const TimeDisplay = {
  props: {
    time: {
      type: Object,
      required: true
    },
    pad: {
      type: Function,
      required: true
    }
  },
  template: `
          <div class="time-display">
            <div class="group">
              <span>{{pad(time.minutes)[0]}}</span>
              <span>{{pad(time.minutes)[1]}}</span>
            </div>
            <div class="separator">:</div>
            <div class="group">
              <span>{{pad(time.seconds)[0]}}</span>
              <span>{{pad(time.seconds)[1]}}</span>
            </div>
            <div class="separator">.</div>
            <div class="group">
              <span>{{pad(time.milliseconds)[0]}}</span>
              <span>{{pad(time.milliseconds)[1]}}</span>
            </div>
          </div>
        `
};

export default TimeDisplay;
