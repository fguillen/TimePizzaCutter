var app = new Vue({
  el: '#app',
  data: {
    settings: {
      minutes: 30,
      portions: 5
    },
    state: {
      secondsPassed: 0,
      portionsDoneSeconds: [],
      actualPortionSecondsPassed: 0,
      started: false,
      paused: true
    }
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
    secondsLeft: function() {
      return ((this.settings.minutes * 60) - this.state.secondsPassed);
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
      return ((this.state.secondsPassed * 100) / (this.settings.minutes * 60))
    },
    timeLeftPercentage: function () {
      return 100 - this.timeUsedPercentage;
    },
    timeUsedPercentageActualPortion: function () {
      return ((this.state.actualPortionSecondsPassed * 100) / this.portionsToDoSecondsEach)
    },
    timeLeftPercentageActualPortion: function () {
      return 100 - this.timeUsedPercentageActualPortion;
    },
    timeLeftHumanFormat: function () {
      var totalSeconds = (this.settings.minutes * 60) - this.state.secondsPassed;
      var minutes = Math.trunc(totalSeconds / 60)
      var seconds = (totalSeconds % 60)

      return minutes + " minutes and " + seconds + " seconds";
    },
    timeLeftActualPortionHumanFormat: function () {
      var totalSeconds = Math.trunc(this.portionsToDoSecondsEach) - this.state.actualPortionSecondsPassed;
      var minutes = Math.trunc(totalSeconds / 60)
      var seconds = (totalSeconds % 60)

      return minutes + " minutes and " + seconds + " seconds";
    },
    showStartButton: function () {
      return !this.state.started;
    },
    showPauseButton: function () {
      return this.state.started && !this.state.paused;
    },
    showResetButton: function () {
      return this.state.started && this.state.paused;
    },
    showResumeButton: function () {
      return this.state.started && this.state.paused;
    }
  },
  methods: {
    increaseSecond: function() {
      console.log("increaseSecond()");

      this.state.actualPortionSecondsPassed ++;
      this.state.secondsPassed ++;

      if(!this.state.paused) {
        setTimeout(this.increaseSecond, 1000);
      }
    },
    start: function() {
      this.reset();

      this.state.paused = false;
      this.state.started = true;

      this.increaseSecond();
    },
    reset: function() {
      console.log("start()");

      this.state.secondsPassed = 0;
      this.state.portionsDoneSeconds = [];
      this.state.actualPortionSecondsPassed = 0;
      this.state.paused = true;
      this.state.started = false;
    },
    pause: function() {
      console.log("pause()");

      this.state.paused = true;

      this.increaseSecond();
    },
    resume: function() {
      console.log("resume()");

      this.state.paused = false;

      this.increaseSecond();
    },
    portionDone: function() {
      console.log("portionDone()");

      if(this.portionsDoneCount === this.settings.portions) {
        return;
      }

      this.state.portionsDoneSeconds.push(this.state.actualPortionSecondsPassed);
      this.state.actualPortionSecondsPassed = 0;
    },
    portionUndone: function() {
      console.log("portionUndone()");

      if(this.portionsDoneCount === 0) {
        return;
      }

      var timeLastPortion = this.state.portionsDoneSeconds.pop();
      this.state.actualPortionSecondsPassed = this.state.actualPortionSecondsPassed + timeLastPortion;
    }
  }
})
