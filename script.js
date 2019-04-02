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
      return ((this.state.actualPortionSecondsPassed * 100) / this.portionsToDoSecondsEach)
    },
    timeUsedHumanFormat: function () {
      var minutes = Math.trunc(this.state.actualPortionSecondsPassed / 60)
      var seconds = (this.state.actualPortionSecondsPassed % 60)

      return minutes + " minutes and " + seconds + " seconds";
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
      console.log("start()");

      this.state.secondsPassed = 0;
      this.state.portionsDoneSeconds = [];
      this.state.actualPortionSecondsPassed = 0;
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
