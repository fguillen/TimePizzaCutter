var app = new Vue({
  el: '#app',
  data: {
    settings: {
      minutes: 30,
      portions: 5
    },
    state: {
      actualTime: null,
      startingTime: null,
      portionStartingTime: null,
      secondsPassed: 0,
      portionSecondsPassed: 0,
      portionsDoneSeconds: [],
      portionSecondsPassed: 0,
      started: false
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
    portionSecondsPassed: function() {
      return Math.round((this.state.actualTime - this.state.portionStartingTime) / 1000);
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
      return ((this.secondsPassed * 100) / (this.settings.minutes * 60))
    },
    timeLeftPercentage: function () {
      return 100 - this.timeUsedPercentage;
    },
    timeUsedPercentageActualPortion: function () {
      return ((this.portionSecondsPassed * 100) / this.portionsToDoSecondsEach)
    },
    timeLeftPercentageActualPortion: function () {
      return 100 - this.timeUsedPercentageActualPortion;
    },
    timeLeftHumanFormat: function () {
      var totalSeconds = (this.settings.minutes * 60) - this.secondsPassed;
      var minutes = Math.trunc(totalSeconds / 60)
      var seconds = (totalSeconds % 60)

      return minutes + " minutes and " + seconds + " seconds";
    },
    timeLeftActualPortionHumanFormat: function () {
      var totalSeconds = Math.trunc(this.portionsToDoSecondsEach) - this.portionSecondsPassed;
      var minutes = Math.trunc(totalSeconds / 60)
      var seconds = (totalSeconds % 60)

      return minutes + " minutes and " + seconds + " seconds";
    },
    showStartButton: function () {
      return !this.state.started;
    },
    showResetButton: function () {
      return this.state.started;
    }
  },
  methods: {
    increaseSecond: function() {
      console.log("increaseSecond()");

      this.state.actualTime = new Date();

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
    },
    portionDone: function() {
      console.log("portionDone()");

      if(this.portionsDoneCount === this.settings.portions) {
        return;
      }

      this.state.portionsDoneSeconds.push(this.portionSecondsPassed);
      this.state.portionStartingTime = new Date();
    },
    portionUndone: function() {
      console.log("portionUndone()");

      if(this.portionsDoneCount === 0) {
        return;
      }

      var timeLastPortion = this.state.portionsDoneSeconds.pop();
      this.state.portionStartingTime = new Date(this.state.portionStartingTime - (this.portionSecondsPassed * 1000));
    }
  }
})
