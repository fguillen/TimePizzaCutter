var version = "0.1.0"
console.log("Loading app version", version);

var app = new Vue({
  el: '#app',
  data: {
    settings: {
      minutes: 30,
      portions: 5
    },
    state: {
      bellActive: false,
      bellRinging: false,
      bellMuted: false,
      portionBellActive: false,
      portionBellRinging: false,
      portionBellMuted: false,
      actualTime: null,
      startingTime: null,
      portionStartingTime: null,
      secondsPassed: 0,
      portionSecondsPassed: 0,
      portionsDoneSeconds: [],
      started: false,
      bellSound: null,
      portionBellSound: null
    }
  },
  created: function() {
    console.log("created()");
    this.state.bellSound = new Audio("./bell.mp3");
    this.state.portionBellSound = new Audio("./bell.mp3");
  },
  computed: {
    portionsDoneCount: function () {
      return this.state.portionsDoneSeconds.length;
    },
    portionsToDoCount: function () {
      return this.settings.portions - this.portionsDoneCount;
    },
    portionsDoneSecondsTotal: function() {
      return _.reduce(this.state.portionsDoneSeconds, function(memo, seconds) { return memo + seconds }, 0);
    },
    portionsDoneSecondsAverage: function () {
      if(this.portionsDoneCount === 0) {
        return 0;
      } else {
        return this.portionsDoneSecondsTotal / this.portionsDoneCount;
      }
    },
    portionsDoneMinutesAverage: function () {
      return Math.round((this.portionsDoneSecondsAverage / 60) * 10) / 10;
    },
    portionSecondsPassed: function() {
      return Math.round((this.state.actualTime - this.state.portionStartingTime) / 1000);
    },
    portionSecondsLeft: function() {
      return Math.round(this.portionsToDoSecondsEach) - this.portionSecondsPassed;
    },
    secondsPassed: function() {
      return Math.round((this.state.actualTime - this.state.startingTime) / 1000);
    },
    secondsLeft: function() {
      return ((this.settings.minutes * 60) - this.secondsPassed);
    },
    portionsToDoSecondsEach: function () {
      if(this.portionsToDoCount === 0 || this.secondsLeft === 0) {
        return 0;
      } else {
        return ((this.settings.minutes * 60) - this.portionsDoneSecondsTotal) / this.portionsToDoCount;
      }
    },
    portionsToDoMinutesEach: function () {
      return Math.round((this.portionsToDoSecondsEach / 60) * 10) / 10;
    },
    timeUsedPercentage: function () {
      var result = ((this.secondsPassed * 100) / (this.settings.minutes * 60));

      if(result > 100) {
        result = 100;
      }

      return result;
    },
    timeLeftPercentage: function () {
      return (100 - this.timeUsedPercentage);
    },
    timeUsedPercentageActualPortion: function () {
      var result = ((this.portionSecondsPassed * 100) / this.portionsToDoSecondsEach);

      if(result > 100) {
        result = 100;
      }

      return result;
    },
    timeLeftPercentageActualPortion: function () {
      return 100 - this.timeUsedPercentageActualPortion;
    },
    timeLeftHumanFormat: function () {
      var minutes = Math.round(this.secondsLeft / 60)
      var seconds = (this.secondsLeft % 60)

      return minutes + " minutes and " + seconds + " seconds";
    },
    timeLeftActualPortionHumanFormat: function () {
      var minutes = Math.round(this.portionSecondsLeft / 60)
      var seconds = (this.portionSecondsLeft % 60)

      return minutes + " minutes and " + seconds + " seconds";
    },
    showStartButton: function () {
      return !this.state.started;
    },
    showResetButton: function () {
      return this.state.started;
    },
    showBellActive: function () {
      return this.state.bellActive && !this.state.bellRinging;
    },
    showBellNoActive: function () {
      return !this.state.bellActive && !this.state.bellRinging;
    },
    showBellRinging: function () {
      return this.state.bellRinging;
    },
    showPortionBellActive: function () {
      return this.state.portionBellActive && !this.state.portionBellRinging;
    },
    showPortionBellNoActive: function () {
      return !this.state.portionBellActive && !this.state.portionBellRinging;
    },
    showPortionBellRiging: function () {
      return this.state.portionBellRinging;
    },
    showPortionBellRinging: function () {
      return this.state.portionBellRinging;
    },
    timeout: function() {
      return this.secondsLeft < 0
    },
    portionTimeout: function() {
      return this.portionSecondsLeft < 0;
    }
  },
  methods: {
    increaseSecond: function() {
      console.log("increaseSecond()");

      this.state.actualTime = new Date();
      this.checkTimeout();
      this.checkTimeoutPortion();

      if(this.state.started) {
        setTimeout(this.increaseSecond, 1000);
      }
    },
    start: function() {
      this.reset();

      this.state.actualTime = new Date();
      this.state.started = true;
      this.state.startingTime = new Date();
      this.state.portionStartingTime = new Date();

      this.increaseSecond();
    },
    reset: function() {
      console.log("start()");

      this.state.startingTime = new Date();
      this.state.portionStartingTime = new Date();
      this.state.actualTime = new Date();
      this.state.portionsDoneSeconds = [];
      this.state.started = false;
      this.state.bellMuted = false
      this.state.bellRinging = false
      this.state.portionBellRinging = false
      this.state.portionBellMuted = false
    },
    portionDone: function() {
      console.log("portionDone()");

      if(this.portionsDoneCount === this.settings.portions) {
        return;
      }

      this.state.portionsDoneSeconds.push(this.portionSecondsPassed);
      this.state.portionStartingTime = new Date();
      this.state.portionBellMuted = false
      this.state.portionBellRinging = false
    },
    portionUndone: function() {
      console.log("portionUndone()");

      if(this.portionsDoneCount === 0) {
        return;
      }

      var timeLastPortion = this.state.portionsDoneSeconds.pop();
      this.state.portionStartingTime = new Date(this.state.portionStartingTime - (this.portionSecondsPassed * 1000));
    },
    deactiveBell: function() {
      console.log("deactiveBell");
      this.state.bellActive = false;
    },
    activeBell: function() {
      console.log("activeBell");
      this.state.bellActive = true;
    },
    muteBell: function() {
      console.log("muteBell()");
      this.state.bellMuted = true;
      this.state.bellRinging = false;
    },
    portionDeactiveBell: function() {
      console.log("portionDeactiveBell");
      this.state.portionBellActive = false;
    },
    portionActiveBell: function() {
      console.log("portionActiveBell");
      this.state.portionBellActive = true;
    },
    portionMuteBell: function() {
      console.log("portionMuteBell()");
      this.state.portionBellMuted = true;
      this.state.portionBellRinging = false;
    },
    checkTimeout: function() {
      console.log("checkTimeout()", this.timeout);

      if(this.timeout){
        if(!this.state.bellMuted) {
          this.state.bellRinging = true;
        }

        if(this.state.bellActive && !this.state.bellMuted) {
          this.soundBell()
        };
      }
    },
    checkTimeoutPortion: function() {
      console.log("checkTimeoutPortion()");

      if(this.portionTimeout){
        if(!this.state.portionBellMuted) {
          this.state.portionBellRinging = true;
        }

        if(this.state.portionBellActive && !this.state.portionBellMuted) {
          this.soundPortionBell();
        }
      }
    },
    soundBell: function() {
      console.log("soundBell()");
      this.state.bellSound.play();
    },
    soundPortionBell: function() {
      console.log("soundPortionBell()");
      this.state.portionBellSound.play();
    }
  }
})
