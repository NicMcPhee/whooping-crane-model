(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){

var rng;

if (global.crypto && crypto.getRandomValues) {
  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
  // Moderately fast, high quality
  var _rnds8 = new Uint8Array(16);
  rng = function whatwgRNG() {
    crypto.getRandomValues(_rnds8);
    return _rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var  _rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return _rnds;
  };
}

module.exports = rng;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy91dWlkL3JuZy1icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJcbnZhciBybmc7XG5cbmlmIChnbG9iYWwuY3J5cHRvICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcbiAgLy8gV0hBVFdHIGNyeXB0by1iYXNlZCBSTkcgLSBodHRwOi8vd2lraS53aGF0d2cub3JnL3dpa2kvQ3J5cHRvXG4gIC8vIE1vZGVyYXRlbHkgZmFzdCwgaGlnaCBxdWFsaXR5XG4gIHZhciBfcm5kczggPSBuZXcgVWludDhBcnJheSgxNik7XG4gIHJuZyA9IGZ1bmN0aW9uIHdoYXR3Z1JORygpIHtcbiAgICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKF9ybmRzOCk7XG4gICAgcmV0dXJuIF9ybmRzODtcbiAgfTtcbn1cblxuaWYgKCFybmcpIHtcbiAgLy8gTWF0aC5yYW5kb20oKS1iYXNlZCAoUk5HKVxuICAvL1xuICAvLyBJZiBhbGwgZWxzZSBmYWlscywgdXNlIE1hdGgucmFuZG9tKCkuICBJdCdzIGZhc3QsIGJ1dCBpcyBvZiB1bnNwZWNpZmllZFxuICAvLyBxdWFsaXR5LlxuICB2YXIgIF9ybmRzID0gbmV3IEFycmF5KDE2KTtcbiAgcm5nID0gZnVuY3Rpb24oKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIHI7IGkgPCAxNjsgaSsrKSB7XG4gICAgICBpZiAoKGkgJiAweDAzKSA9PT0gMCkgciA9IE1hdGgucmFuZG9tKCkgKiAweDEwMDAwMDAwMDtcbiAgICAgIF9ybmRzW2ldID0gciA+Pj4gKChpICYgMHgwMykgPDwgMykgJiAweGZmO1xuICAgIH1cblxuICAgIHJldHVybiBfcm5kcztcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBybmc7XG5cbiJdfQ==
},{}],2:[function(require,module,exports){
//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

// Unique ID creation requires a high quality random # generator.  We feature
// detect to determine the best RNG source, normalizing to a function that
// returns 128-bits of randomness, since that's what's usually required
var _rng = require('./rng');

// Maps for number <-> hex string conversion
var _byteToHex = [];
var _hexToByte = {};
for (var i = 0; i < 256; i++) {
  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
  _hexToByte[_byteToHex[i]] = i;
}

// **`parse()` - Parse a UUID into it's component bytes**
function parse(s, buf, offset) {
  var i = (buf && offset) || 0, ii = 0;

  buf = buf || [];
  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
    if (ii < 16) { // Don't overflow!
      buf[i + ii++] = _hexToByte[oct];
    }
  });

  // Zero out remaining bytes if string was short
  while (ii < 16) {
    buf[i + ii++] = 0;
  }

  return buf;
}

// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
function unparse(buf, offset) {
  var i = offset || 0, bth = _byteToHex;
  return  bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = _rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0, _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; n++) {
    b[i + n] = node[n];
  }

  return buf ? buf : unparse(b);
}

// **`v4()` - Generate random UUID**

// See https://github.com/broofa/node-uuid for API details
function v4(options, buf, offset) {
  // Deprecated - 'format' argument, as supported in v1.2
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || _rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ii++) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || unparse(rnds);
}

// Export public API
var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;
uuid.parse = parse;
uuid.unparse = unparse;

module.exports = uuid;

},{"./rng":1}],3:[function(require,module,exports){

/*

Basic model of an individual bird (whooping crane).

https://github.com/NicMcPhee/whooping-crane-model

Copyright (c) 2015 Nic McPhee
Licensed under the MIT license.
 */

(function() {
  'use strict';
  var Bird, Clock;

  Clock = require('./clock');

  Bird = (function() {
    Bird.uuidFactory = require('uuid');

    Bird.pairingAge = 4;

    Bird.nestingProbability = 0.5;

    Bird.collectionProbability = 0.5;

    Bird.releaseCount = 6;

    Bird.eggConversionRate = 0.5;

    Bird.mutationRate = 0.001;

    Bird.firstYearMortalityRate = 0.6;

    Bird.matureMortalityRate = 0.1;

    Bird.EARLY = 0;

    Bird.LATE = 1;

    Bird.WILD_REARED = 2;

    Bird.CAPTIVE_REARED = 3;

    function Bird(_nestingPreference, _howReared) {
      this._nestingPreference = _nestingPreference;
      this._howReared = _howReared;
      this.birthYear = Clock.currentYear;
      this.uuid = Bird.uuidFactory.v4();
      if (this._nestingPreference == null) {
        this._nestingPreference = Math.random() < 0.5 ? Bird.EARLY : Bird.LATE;
      }
    }

    Bird.fromNest = function(nest, howReared) {
      var babyPreference, firstParent, secondParent;
      firstParent = nest.builders()[0];
      secondParent = nest.builders()[1];
      if (firstParent.nestingPreference() === secondParent.nestingPreference()) {
        babyPreference = firstParent.nestingPreference();
        if (Math.random() < Bird.mutationRate) {
          babyPreference = Bird.flip(babyPreference);
        }
      } else if (Math.random() < 0.5) {
        babyPreference = Bird.EARLY;
      } else {
        babyPreference = Bird.LATE;
      }
      return new Bird(babyPreference, howReared);
    };

    Bird.prototype.age = function() {
      return Clock.currentYear - this.birthYear;
    };

    Bird.prototype.canMate = function() {
      return this.age() >= Bird.pairingAge;
    };

    Bird.prototype.nestingPreference = function() {
      return this._nestingPreference;
    };

    Bird.prototype.isEarly = function() {
      return this._nestingPreference === Bird.EARLY;
    };

    Bird.prototype.isLate = function() {
      return this._nestingPreference === Bird.LATE;
    };

    Bird.prototype.howReared = function() {
      return this._howReared;
    };

    Bird.prototype.isCaptive = function() {
      return this._howReared === Bird.CAPTIVE_REARED;
    };

    Bird.prototype.isWild = function() {
      return this._howReared === Bird.WILD_REARED;
    };

    Bird.flip = function(preference) {
      if (preference === Bird.EARLY) {
        return Bird.LATE;
      } else {
        return Bird.EARLY;
      }
    };

    Bird.prototype.survives = function() {
      var mortality;
      mortality = Bird.matureMortalityRate;
      if (this.age() === 0) {
        mortality = Bird.firstYearMortalityRate;
      }
      return Math.random() >= mortality;
    };

    return Bird;

  })();

  module.exports = Bird;

}).call(this);

},{"./clock":4,"uuid":2}],4:[function(require,module,exports){

/*

The global clock for the simulation that knows what
year it is in the simulation.

https://github.com/NicMcPhee/whooping-crane-model

Copyright (c) 2015 Nic McPhee
Licensed under the MIT license.
 */

(function() {
  'use strict';
  var Clock;

  Clock = (function() {
    function Clock() {}

    Clock.currentYear = 0;

    Clock.reset = function() {
      return this.currentYear = 0;
    };

    Clock.incrementYear = function() {
      return this.currentYear = this.currentYear + 1;
    };

    Clock.setYear = function(year) {
      return this.currentYear = year;
    };

    return Clock;

  })();

  module.exports = Clock;

}).call(this);

},{}],5:[function(require,module,exports){

/*

Basic model of an nest.

https://github.com/NicMcPhee/whooping-crane-model

Copyright (c) 2015 Nic McPhee
Licensed under the MIT license.
 */

(function() {
  'use strict';
  var Bird, Nest;

  Bird = require('../lib/bird');

  Nest = (function() {
    function Nest(_builders) {
      var firstParent, secondParent;
      this._builders = _builders;
      firstParent = this._builders[0];
      secondParent = this._builders[1];
      if (firstParent.nestingPreference() === secondParent.nestingPreference()) {
        this._nestingTime = firstParent.nestingPreference();
      } else {
        this._nestingTime = Bird.EARLY;
      }
    }

    Nest.prototype.builders = function() {
      return this._builders;
    };

    Nest.prototype.nestingTime = function() {
      return this._nestingTime;
    };

    return Nest;

  })();

  module.exports = Nest;

}).call(this);

},{"../lib/bird":3}],6:[function(require,module,exports){

/*

Basic model of a population's collection of nests.

https://github.com/NicMcPhee/whooping-crane-model

Copyright (c) 2015 Nic McPhee
Licensed under the MIT license.
 */

(function() {
  'use strict';
  var Bird, Nest, Nesting, shuffle,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Bird = require('../lib/bird');

  Nest = require('../lib/nest');

  shuffle = function(a) {
    var i, j, t;
    i = a.length;
    while (--i > 0) {
      j = ~~(Math.random() * (i + 1));
      t = a[j];
      a[j] = a[i];
      a[i] = t;
    }
    return a;
  };

  Nesting = (function() {
    function Nesting(matingPairs) {
      var nestingPairs, p;
      nestingPairs = matingPairs.filter(function(pr) {
        return Math.random() < Bird.nestingProbability;
      });
      this._activeNests = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = nestingPairs.length; _i < _len; _i++) {
          p = nestingPairs[_i];
          _results.push(new Nest(p));
        }
        return _results;
      })();
      this._collectedNests = [];
      this._releasedNests = [];
      this._abandonedNests = [];
    }

    Nesting.prototype.activeNests = function() {
      return this._activeNests;
    };

    Nesting.prototype.collectedNests = function() {
      return this._collectedNests;
    };

    Nesting.prototype.releasedNests = function() {
      return this._releasedNests;
    };

    Nesting.prototype.abandonedNests = function() {
      return this._abandonedNests;
    };

    Nesting.prototype.collectEggs = function() {
      var earlyNests, numToCollect;
      earlyNests = this._activeNests.filter(function(n) {
        return n.nestingTime() === Bird.EARLY;
      });
      shuffle(earlyNests);
      numToCollect = Math.floor(earlyNests.length * Bird.collectionProbability);
      this._collectedNests = earlyNests.slice(0, numToCollect);
      this._activeNests = this._activeNests.filter((function(_this) {
        return function(n) {
          return __indexOf.call(_this._collectedNests, n) < 0;
        };
      })(this));
      return this._releasedNests = this._collectedNests.slice(0, Bird.releaseCount);
    };

    Nesting.prototype.abandonNests = function() {
      this._abandonedNests = this._activeNests.filter(function(n) {
        return n.nestingTime() === Bird.EARLY;
      });
      return this._activeNests = this._activeNests.filter(function(n) {
        return n.nestingTime() === Bird.LATE;
      });
    };

    Nesting.prototype.hatchNests = function(birdType, nests) {
      var nest, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = nests.length; _i < _len; _i++) {
        nest = nests[_i];
        _results.push(Bird.fromNest(nest, birdType));
      }
      return _results;
    };

    Nesting.prototype.hatchEggs = function() {
      var hatchedWildNests, newCaptiveBirds, newWildBirds;
      hatchedWildNests = this._activeNests.filter(function(n) {
        return Math.random() < Bird.eggConversionRate;
      });
      newWildBirds = this.hatchNests(Bird.WILD_REARED, hatchedWildNests);
      newCaptiveBirds = this.hatchNests(Bird.CAPTIVE_REARED, this._releasedNests);
      return newWildBirds.concat(newCaptiveBirds);
    };

    Nesting.prototype.reproductionCycle = function() {
      this.collectEggs();
      this.abandonNests();
      return this.hatchEggs();
    };

    return Nesting;

  })();

  module.exports = Nesting;

}).call(this);

},{"../lib/bird":3,"../lib/nest":5}],7:[function(require,module,exports){

/*

Basic model of a population of birds (whooping cranes).

https://github.com/NicMcPhee/whooping-crane-model

Copyright (c) 2015 Nic McPhee
Licensed under the MIT license.
 */

(function() {
  'use strict';
  var Bird, Population, chunk, shuffle,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Bird = require('./bird');

  shuffle = function(a) {
    var i, j, t;
    i = a.length;
    while (--i > 0) {
      j = ~~(Math.random() * (i + 1));
      t = a[j];
      a[j] = a[i];
      a[i] = t;
    }
    return a;
  };

  chunk = function(array, chunkSize) {
    return [].concat.apply([], array.map(function(elem, i) {
      if (i % chunkSize) {
        return [];
      } else {
        return [array.slice(i, i + chunkSize)];
      }
    }));
  };

  Population = (function() {
    function Population(popSize) {
      this._unpairedBirds = (function() {
        var _i, _results;
        _results = [];
        for (_i = 0; 0 <= popSize ? _i < popSize : _i > popSize; 0 <= popSize ? _i++ : _i--) {
          _results.push(new Bird());
        }
        return _results;
      })();
      this._pairings = [];
    }

    Population.prototype.addBird = function(bird) {
      if (bird == null) {
        bird = new Bird();
      }
      return this._unpairedBirds.push(bird);
    };

    Population.prototype.birds = function() {
      return this._unpairedBirds.concat([].concat.apply([], this._pairings));
    };

    Population.prototype.unpairedBirds = function() {
      return this._unpairedBirds;
    };

    Population.prototype.matingPairs = function() {
      return this._pairings;
    };

    Population.prototype.size = function() {
      return this._unpairedBirds.length + 2 * this._pairings.length;
    };

    Population.prototype.mateUnpairedBirds = function() {
      var toMate;
      toMate = this._unpairedBirds.filter(function(b) {
        return b.canMate();
      });
      if (toMate.length % 2 === 1) {
        toMate = toMate.slice(1);
      }
      shuffle(toMate);
      this._unpairedBirds = this._unpairedBirds.filter(function(b) {
        return !(__indexOf.call(toMate, b) >= 0);
      });
      return this._pairings = this._pairings.concat(chunk(toMate, 2));
    };

    Population.prototype.mortalityPass = function() {
      var pair, survivingPairs, survivors, _i, _len, _ref;
      this._unpairedBirds = this._unpairedBirds.filter(function(b) {
        return b.survives();
      });
      survivingPairs = [];
      _ref = this._pairings;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pair = _ref[_i];
        survivors = pair.filter(function(b) {
          return b.survives();
        });
        if (survivors.length === 2) {
          survivingPairs.push(pair);
        } else if (survivors.length === 1) {
          this._unpairedBirds.push(survivors[0]);
        }
      }
      return this._pairings = survivingPairs;
    };

    Population.prototype.capToCarryingCapacity = function() {};

    return Population;

  })();

  module.exports = Population;

}).call(this);

},{"./bird":3}],8:[function(require,module,exports){
(function() {
  'use strict';
  var Population, RickshawStripChart, Simulator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Simulator = require('./simulator');

  Population = require('./population');

  RickshawStripChart = (function() {
    RickshawStripChart.prototype.values = null;

    RickshawStripChart.prototype.year = 2015;

    RickshawStripChart.prototype.numYears = 100;

    RickshawStripChart.prototype.runNumber = 0;

    RickshawStripChart.prototype.numRuns = 50;

    RickshawStripChart.prototype.tickLength = 1;

    RickshawStripChart.prototype.isRunning = false;

    RickshawStripChart.prototype.hasStarted = false;

    RickshawStripChart.prototype.notDone = true;

    function RickshawStripChart() {
      this.tick = __bind(this.tick, this);
      this.values = [];
      this.buildChart();
      $("#start_button").click((function(_this) {
        return function() {
          return _this.toggle_running();
        };
      })(this));
    }

    RickshawStripChart.prototype.toggle_running = function() {
      this.isRunning = !this.isRunning;
      if (!this.hasStarted) {
        this.start();
      }
      if (this.isRunning && this.notDone) {
        $("#start_button").text("Stop");
        return this.tick();
      } else {
        return $("#start_button").text("Start");
      }
    };

    RickshawStripChart.prototype.start = function() {
      this.initialNumCranes = Number($("#num_cranes").val());
      this.values.length = 0;
      this.runNumber = 0;
      this.hasStarted = true;
      return this.notDone = true;
    };

    RickshawStripChart.prototype.buildChart = function() {
      var hoverDetail, xAxis, x_axis, yAxis, y_axis;
      this.chart = new Rickshaw.Graph({
        element: document.getElementById('chart'),
        width: 800,
        height: 300,
        renderer: 'line',
        series: this.values,
        min: -50
      });
      xAxis = new Rickshaw.Graph.Axis.X({
        graph: this.chart
      });
      yAxis = new Rickshaw.Graph.Axis.Y({
        graph: this.chart
      });
      hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph: this.chart,
        xFormatter: function(year) {
          return "Year " + year;
        },
        yFormatter: function(numCranes) {
          return "" + (Math.round(numCranes)) + " cranes";
        }
      });
      x_axis = new Rickshaw.Graph.Axis.X({
        graph: this.chart
      });
      return y_axis = new Rickshaw.Graph.Axis.Y({
        graph: this.chart
      });
    };

    RickshawStripChart.prototype.drawChart = function() {
      return this.chart.render();
    };

    RickshawStripChart.prototype.extendData = function() {
      var entries, entry, popSize, population, simulator, year, years, _i, _j, _len, _ref, _ref1, _results;
      years = (function() {
        _results = [];
        for (var _i = _ref = this.year, _ref1 = this.year + this.numYears; _ref <= _ref1 ? _i < _ref1 : _i > _ref1; _ref <= _ref1 ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this);
      population = new Population(this.initialNumCranes);
      simulator = new Simulator(population);
      entries = [];
      for (_j = 0, _len = years.length; _j < _len; _j++) {
        year = years[_j];
        popSize = simulator.getPopulation().birds().length;
        entry = {
          x: year,
          y: popSize
        };
        entries.push(entry);
        if (popSize <= 0) {
          break;
        }
        simulator.advanceOneYear();
      }
      return this.values.push({
        name: "Run #" + this.runNumber,
        color: "rgba(0, 0, 0, 0.1)",
        data: entries
      });
    };

    RickshawStripChart.prototype.tick = function() {
      this.extendData();
      this.drawChart();
      this.runNumber = this.runNumber + 1;
      this.notDone = this.runNumber < this.numRuns;
      if (!this.notDone) {
        this.isRunning = false;
        this.hasStarted = false;
        $("#start_button").text("Restart");
      }
      console.log("Run number " + this.runNumber + ", len vals = " + this.values.length);
      if (this.isRunning && this.notDone) {
        return setTimeout(this.tick, this.tickLength);
      }
    };

    return RickshawStripChart;

  })();

  window.RickshawStripChart = RickshawStripChart;

}).call(this);

},{"./population":7,"./simulator":9}],9:[function(require,module,exports){

/*

Basic simulator that's in charge of running through
the events for a year, and then running multiple
years.

https://github.com/NicMcPhee/whooping-crane-model

Copyright (c) 2015 Nic McPhee
Licensed under the MIT license.
 */

(function() {
  'use strict';
  var Clock, Nesting, Simulator;

  Clock = require('./clock');

  Nesting = require('./nesting');

  Simulator = (function() {
    function Simulator(population) {
      this.population = population;
    }

    Simulator.prototype.advanceOneYear = function() {
      var b, nesting, newBirds, _i, _len;
      Clock.incrementYear();
      this.population.mateUnpairedBirds();
      nesting = new Nesting(this.population.matingPairs());
      newBirds = nesting.reproductionCycle();
      for (_i = 0, _len = newBirds.length; _i < _len; _i++) {
        b = newBirds[_i];
        this.population.addBird(b);
      }
      this.population.mortalityPass();
      this.population.capToCarryingCapacity();
    };

    Simulator.prototype.getPopulation = function() {
      return this.population;
    };

    return Simulator;

  })();

  module.exports = Simulator;

}).call(this);

},{"./clock":4,"./nesting":6}],10:[function(require,module,exports){

/*

whooping-crane-model
https://github.com/NicMcPhee/whooping-crane-model

Copyright (c) 2015 Nic McPhee
Licensed under the MIT license.
 */

(function() {
  'use strict';
  exports.awesome = function() {
    return 'awesome';
  };

}).call(this);

},{}]},{},[3,4,5,6,7,8,9,10])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9tY3BoZWUvRG9jdW1lbnRzL1Jlc2VhcmNoL3dob29waW5nLWNyYW5lLW1vZGVsL25vZGVfbW9kdWxlcy91dWlkL3JuZy1icm93c2VyLmpzIiwiL1VzZXJzL21jcGhlZS9Eb2N1bWVudHMvUmVzZWFyY2gvd2hvb3BpbmctY3JhbmUtbW9kZWwvbm9kZV9tb2R1bGVzL3V1aWQvdXVpZC5qcyIsIi9Vc2Vycy9tY3BoZWUvRG9jdW1lbnRzL1Jlc2VhcmNoL3dob29waW5nLWNyYW5lLW1vZGVsL291dC9saWIvYmlyZC5qcyIsIi9Vc2Vycy9tY3BoZWUvRG9jdW1lbnRzL1Jlc2VhcmNoL3dob29waW5nLWNyYW5lLW1vZGVsL291dC9saWIvY2xvY2suanMiLCIvVXNlcnMvbWNwaGVlL0RvY3VtZW50cy9SZXNlYXJjaC93aG9vcGluZy1jcmFuZS1tb2RlbC9vdXQvbGliL25lc3QuanMiLCIvVXNlcnMvbWNwaGVlL0RvY3VtZW50cy9SZXNlYXJjaC93aG9vcGluZy1jcmFuZS1tb2RlbC9vdXQvbGliL25lc3RpbmcuanMiLCIvVXNlcnMvbWNwaGVlL0RvY3VtZW50cy9SZXNlYXJjaC93aG9vcGluZy1jcmFuZS1tb2RlbC9vdXQvbGliL3BvcHVsYXRpb24uanMiLCIvVXNlcnMvbWNwaGVlL0RvY3VtZW50cy9SZXNlYXJjaC93aG9vcGluZy1jcmFuZS1tb2RlbC9vdXQvbGliL3JpY2tzaGF3X3N0cmlwX2NoYXJ0LmpzIiwiL1VzZXJzL21jcGhlZS9Eb2N1bWVudHMvUmVzZWFyY2gvd2hvb3BpbmctY3JhbmUtbW9kZWwvb3V0L2xpYi9zaW11bGF0b3IuanMiLCIvVXNlcnMvbWNwaGVlL0RvY3VtZW50cy9SZXNlYXJjaC93aG9vcGluZy1jcmFuZS1tb2RlbC9vdXQvbGliL3dob29waW5nLWNyYW5lLW1vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuXG52YXIgcm5nO1xuXG5pZiAoZ2xvYmFsLmNyeXB0byAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XG4gIC8vIFdIQVRXRyBjcnlwdG8tYmFzZWQgUk5HIC0gaHR0cDovL3dpa2kud2hhdHdnLm9yZy93aWtpL0NyeXB0b1xuICAvLyBNb2RlcmF0ZWx5IGZhc3QsIGhpZ2ggcXVhbGl0eVxuICB2YXIgX3JuZHM4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuICBybmcgPSBmdW5jdGlvbiB3aGF0d2dSTkcoKSB7XG4gICAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhfcm5kczgpO1xuICAgIHJldHVybiBfcm5kczg7XG4gIH07XG59XG5cbmlmICghcm5nKSB7XG4gIC8vIE1hdGgucmFuZG9tKCktYmFzZWQgKFJORylcbiAgLy9cbiAgLy8gSWYgYWxsIGVsc2UgZmFpbHMsIHVzZSBNYXRoLnJhbmRvbSgpLiAgSXQncyBmYXN0LCBidXQgaXMgb2YgdW5zcGVjaWZpZWRcbiAgLy8gcXVhbGl0eS5cbiAgdmFyICBfcm5kcyA9IG5ldyBBcnJheSgxNik7XG4gIHJuZyA9IGZ1bmN0aW9uKCkge1xuICAgIGZvciAodmFyIGkgPSAwLCByOyBpIDwgMTY7IGkrKykge1xuICAgICAgaWYgKChpICYgMHgwMykgPT09IDApIHIgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDA7XG4gICAgICBfcm5kc1tpXSA9IHIgPj4+ICgoaSAmIDB4MDMpIDw8IDMpICYgMHhmZjtcbiAgICB9XG5cbiAgICByZXR1cm4gX3JuZHM7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcm5nO1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW01dlpHVmZiVzlrZFd4bGN5OTFkV2xrTDNKdVp5MWljbTkzYzJWeUxtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZCUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQklpd2labWxzWlNJNkltZGxibVZ5WVhSbFpDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpjYm5aaGNpQnlibWM3WEc1Y2JtbG1JQ2huYkc5aVlXd3VZM0o1Y0hSdklDWW1JR055ZVhCMGJ5NW5aWFJTWVc1a2IyMVdZV3gxWlhNcElIdGNiaUFnTHk4Z1YwaEJWRmRISUdOeWVYQjBieTFpWVhObFpDQlNUa2NnTFNCb2RIUndPaTh2ZDJscmFTNTNhR0YwZDJjdWIzSm5MM2RwYTJrdlEzSjVjSFJ2WEc0Z0lDOHZJRTF2WkdWeVlYUmxiSGtnWm1GemRDd2dhR2xuYUNCeGRXRnNhWFI1WEc0Z0lIWmhjaUJmY201a2N6Z2dQU0J1WlhjZ1ZXbHVkRGhCY25KaGVTZ3hOaWs3WEc0Z0lISnVaeUE5SUdaMWJtTjBhVzl1SUhkb1lYUjNaMUpPUnlncElIdGNiaUFnSUNCamNubHdkRzh1WjJWMFVtRnVaRzl0Vm1Gc2RXVnpLRjl5Ym1Sek9DazdYRzRnSUNBZ2NtVjBkWEp1SUY5eWJtUnpPRHRjYmlBZ2ZUdGNibjFjYmx4dWFXWWdLQ0Z5Ym1jcElIdGNiaUFnTHk4Z1RXRjBhQzV5WVc1a2IyMG9LUzFpWVhObFpDQW9VazVIS1Z4dUlDQXZMMXh1SUNBdkx5QkpaaUJoYkd3Z1pXeHpaU0JtWVdsc2N5d2dkWE5sSUUxaGRHZ3VjbUZ1Wkc5dEtDa3VJQ0JKZENkeklHWmhjM1FzSUdKMWRDQnBjeUJ2WmlCMWJuTndaV05wWm1sbFpGeHVJQ0F2THlCeGRXRnNhWFI1TGx4dUlDQjJZWElnSUY5eWJtUnpJRDBnYm1WM0lFRnljbUY1S0RFMktUdGNiaUFnY201bklEMGdablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdabTl5SUNoMllYSWdhU0E5SURBc0lISTdJR2tnUENBeE5qc2dhU3NyS1NCN1hHNGdJQ0FnSUNCcFppQW9LR2tnSmlBd2VEQXpLU0E5UFQwZ01Da2djaUE5SUUxaGRHZ3VjbUZ1Wkc5dEtDa2dLaUF3ZURFd01EQXdNREF3TUR0Y2JpQWdJQ0FnSUY5eWJtUnpXMmxkSUQwZ2NpQStQajRnS0NocElDWWdNSGd3TXlrZ1BEd2dNeWtnSmlBd2VHWm1PMXh1SUNBZ0lIMWNibHh1SUNBZ0lISmxkSFZ5YmlCZmNtNWtjenRjYmlBZ2ZUdGNibjFjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCeWJtYzdYRzVjYmlKZGZRPT0iLCIvLyAgICAgdXVpZC5qc1xuLy9cbi8vICAgICBDb3B5cmlnaHQgKGMpIDIwMTAtMjAxMiBSb2JlcnQgS2llZmZlclxuLy8gICAgIE1JVCBMaWNlbnNlIC0gaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXG4vLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiAgV2UgZmVhdHVyZVxuLy8gZGV0ZWN0IHRvIGRldGVybWluZSB0aGUgYmVzdCBSTkcgc291cmNlLCBub3JtYWxpemluZyB0byBhIGZ1bmN0aW9uIHRoYXRcbi8vIHJldHVybnMgMTI4LWJpdHMgb2YgcmFuZG9tbmVzcywgc2luY2UgdGhhdCdzIHdoYXQncyB1c3VhbGx5IHJlcXVpcmVkXG52YXIgX3JuZyA9IHJlcXVpcmUoJy4vcm5nJyk7XG5cbi8vIE1hcHMgZm9yIG51bWJlciA8LT4gaGV4IHN0cmluZyBjb252ZXJzaW9uXG52YXIgX2J5dGVUb0hleCA9IFtdO1xudmFyIF9oZXhUb0J5dGUgPSB7fTtcbmZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgX2J5dGVUb0hleFtpXSA9IChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSk7XG4gIF9oZXhUb0J5dGVbX2J5dGVUb0hleFtpXV0gPSBpO1xufVxuXG4vLyAqKmBwYXJzZSgpYCAtIFBhcnNlIGEgVVVJRCBpbnRvIGl0J3MgY29tcG9uZW50IGJ5dGVzKipcbmZ1bmN0aW9uIHBhcnNlKHMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gKGJ1ZiAmJiBvZmZzZXQpIHx8IDAsIGlpID0gMDtcblxuICBidWYgPSBidWYgfHwgW107XG4gIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bMC05YS1mXXsyfS9nLCBmdW5jdGlvbihvY3QpIHtcbiAgICBpZiAoaWkgPCAxNikgeyAvLyBEb24ndCBvdmVyZmxvdyFcbiAgICAgIGJ1ZltpICsgaWkrK10gPSBfaGV4VG9CeXRlW29jdF07XG4gICAgfVxuICB9KTtcblxuICAvLyBaZXJvIG91dCByZW1haW5pbmcgYnl0ZXMgaWYgc3RyaW5nIHdhcyBzaG9ydFxuICB3aGlsZSAoaWkgPCAxNikge1xuICAgIGJ1ZltpICsgaWkrK10gPSAwO1xuICB9XG5cbiAgcmV0dXJuIGJ1Zjtcbn1cblxuLy8gKipgdW5wYXJzZSgpYCAtIENvbnZlcnQgVVVJRCBieXRlIGFycmF5IChhbGEgcGFyc2UoKSkgaW50byBhIHN0cmluZyoqXG5mdW5jdGlvbiB1bnBhcnNlKGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gb2Zmc2V0IHx8IDAsIGJ0aCA9IF9ieXRlVG9IZXg7XG4gIHJldHVybiAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gKyAnLScgK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dO1xufVxuXG4vLyAqKmB2MSgpYCAtIEdlbmVyYXRlIHRpbWUtYmFzZWQgVVVJRCoqXG4vL1xuLy8gSW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL0xpb3NLL1VVSUQuanNcbi8vIGFuZCBodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvdXVpZC5odG1sXG5cbi8vIHJhbmRvbSAjJ3Mgd2UgbmVlZCB0byBpbml0IG5vZGUgYW5kIGNsb2Nrc2VxXG52YXIgX3NlZWRCeXRlcyA9IF9ybmcoKTtcblxuLy8gUGVyIDQuNSwgY3JlYXRlIGFuZCA0OC1iaXQgbm9kZSBpZCwgKDQ3IHJhbmRvbSBiaXRzICsgbXVsdGljYXN0IGJpdCA9IDEpXG52YXIgX25vZGVJZCA9IFtcbiAgX3NlZWRCeXRlc1swXSB8IDB4MDEsXG4gIF9zZWVkQnl0ZXNbMV0sIF9zZWVkQnl0ZXNbMl0sIF9zZWVkQnl0ZXNbM10sIF9zZWVkQnl0ZXNbNF0sIF9zZWVkQnl0ZXNbNV1cbl07XG5cbi8vIFBlciA0LjIuMiwgcmFuZG9taXplICgxNCBiaXQpIGNsb2Nrc2VxXG52YXIgX2Nsb2Nrc2VxID0gKF9zZWVkQnl0ZXNbNl0gPDwgOCB8IF9zZWVkQnl0ZXNbN10pICYgMHgzZmZmO1xuXG4vLyBQcmV2aW91cyB1dWlkIGNyZWF0aW9uIHRpbWVcbnZhciBfbGFzdE1TZWNzID0gMCwgX2xhc3ROU2VjcyA9IDA7XG5cbi8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYnJvb2ZhL25vZGUtdXVpZCBmb3IgQVBJIGRldGFpbHNcbmZ1bmN0aW9uIHYxKG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuICB2YXIgYiA9IGJ1ZiB8fCBbXTtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB2YXIgY2xvY2tzZXEgPSBvcHRpb25zLmNsb2Nrc2VxICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmNsb2Nrc2VxIDogX2Nsb2Nrc2VxO1xuXG4gIC8vIFVVSUQgdGltZXN0YW1wcyBhcmUgMTAwIG5hbm8tc2Vjb25kIHVuaXRzIHNpbmNlIHRoZSBHcmVnb3JpYW4gZXBvY2gsXG4gIC8vICgxNTgyLTEwLTE1IDAwOjAwKS4gIEpTTnVtYmVycyBhcmVuJ3QgcHJlY2lzZSBlbm91Z2ggZm9yIHRoaXMsIHNvXG4gIC8vIHRpbWUgaXMgaGFuZGxlZCBpbnRlcm5hbGx5IGFzICdtc2VjcycgKGludGVnZXIgbWlsbGlzZWNvbmRzKSBhbmQgJ25zZWNzJ1xuICAvLyAoMTAwLW5hbm9zZWNvbmRzIG9mZnNldCBmcm9tIG1zZWNzKSBzaW5jZSB1bml4IGVwb2NoLCAxOTcwLTAxLTAxIDAwOjAwLlxuICB2YXIgbXNlY3MgPSBvcHRpb25zLm1zZWNzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm1zZWNzIDogbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgLy8gUGVyIDQuMi4xLjIsIHVzZSBjb3VudCBvZiB1dWlkJ3MgZ2VuZXJhdGVkIGR1cmluZyB0aGUgY3VycmVudCBjbG9ja1xuICAvLyBjeWNsZSB0byBzaW11bGF0ZSBoaWdoZXIgcmVzb2x1dGlvbiBjbG9ja1xuICB2YXIgbnNlY3MgPSBvcHRpb25zLm5zZWNzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm5zZWNzIDogX2xhc3ROU2VjcyArIDE7XG5cbiAgLy8gVGltZSBzaW5jZSBsYXN0IHV1aWQgY3JlYXRpb24gKGluIG1zZWNzKVxuICB2YXIgZHQgPSAobXNlY3MgLSBfbGFzdE1TZWNzKSArIChuc2VjcyAtIF9sYXN0TlNlY3MpLzEwMDAwO1xuXG4gIC8vIFBlciA0LjIuMS4yLCBCdW1wIGNsb2Nrc2VxIG9uIGNsb2NrIHJlZ3Jlc3Npb25cbiAgaWYgKGR0IDwgMCAmJiBvcHRpb25zLmNsb2Nrc2VxID09PSB1bmRlZmluZWQpIHtcbiAgICBjbG9ja3NlcSA9IGNsb2Nrc2VxICsgMSAmIDB4M2ZmZjtcbiAgfVxuXG4gIC8vIFJlc2V0IG5zZWNzIGlmIGNsb2NrIHJlZ3Jlc3NlcyAobmV3IGNsb2Nrc2VxKSBvciB3ZSd2ZSBtb3ZlZCBvbnRvIGEgbmV3XG4gIC8vIHRpbWUgaW50ZXJ2YWxcbiAgaWYgKChkdCA8IDAgfHwgbXNlY3MgPiBfbGFzdE1TZWNzKSAmJiBvcHRpb25zLm5zZWNzID09PSB1bmRlZmluZWQpIHtcbiAgICBuc2VjcyA9IDA7XG4gIH1cblxuICAvLyBQZXIgNC4yLjEuMiBUaHJvdyBlcnJvciBpZiB0b28gbWFueSB1dWlkcyBhcmUgcmVxdWVzdGVkXG4gIGlmIChuc2VjcyA+PSAxMDAwMCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXVpZC52MSgpOiBDYW5cXCd0IGNyZWF0ZSBtb3JlIHRoYW4gMTBNIHV1aWRzL3NlYycpO1xuICB9XG5cbiAgX2xhc3RNU2VjcyA9IG1zZWNzO1xuICBfbGFzdE5TZWNzID0gbnNlY3M7XG4gIF9jbG9ja3NlcSA9IGNsb2Nrc2VxO1xuXG4gIC8vIFBlciA0LjEuNCAtIENvbnZlcnQgZnJvbSB1bml4IGVwb2NoIHRvIEdyZWdvcmlhbiBlcG9jaFxuICBtc2VjcyArPSAxMjIxOTI5MjgwMDAwMDtcblxuICAvLyBgdGltZV9sb3dgXG4gIHZhciB0bCA9ICgobXNlY3MgJiAweGZmZmZmZmYpICogMTAwMDAgKyBuc2VjcykgJSAweDEwMDAwMDAwMDtcbiAgYltpKytdID0gdGwgPj4+IDI0ICYgMHhmZjtcbiAgYltpKytdID0gdGwgPj4+IDE2ICYgMHhmZjtcbiAgYltpKytdID0gdGwgPj4+IDggJiAweGZmO1xuICBiW2krK10gPSB0bCAmIDB4ZmY7XG5cbiAgLy8gYHRpbWVfbWlkYFxuICB2YXIgdG1oID0gKG1zZWNzIC8gMHgxMDAwMDAwMDAgKiAxMDAwMCkgJiAweGZmZmZmZmY7XG4gIGJbaSsrXSA9IHRtaCA+Pj4gOCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRtaCAmIDB4ZmY7XG5cbiAgLy8gYHRpbWVfaGlnaF9hbmRfdmVyc2lvbmBcbiAgYltpKytdID0gdG1oID4+PiAyNCAmIDB4ZiB8IDB4MTA7IC8vIGluY2x1ZGUgdmVyc2lvblxuICBiW2krK10gPSB0bWggPj4+IDE2ICYgMHhmZjtcblxuICAvLyBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGAgKFBlciA0LjIuMiAtIGluY2x1ZGUgdmFyaWFudClcbiAgYltpKytdID0gY2xvY2tzZXEgPj4+IDggfCAweDgwO1xuXG4gIC8vIGBjbG9ja19zZXFfbG93YFxuICBiW2krK10gPSBjbG9ja3NlcSAmIDB4ZmY7XG5cbiAgLy8gYG5vZGVgXG4gIHZhciBub2RlID0gb3B0aW9ucy5ub2RlIHx8IF9ub2RlSWQ7XG4gIGZvciAodmFyIG4gPSAwOyBuIDwgNjsgbisrKSB7XG4gICAgYltpICsgbl0gPSBub2RlW25dO1xuICB9XG5cbiAgcmV0dXJuIGJ1ZiA/IGJ1ZiA6IHVucGFyc2UoYik7XG59XG5cbi8vICoqYHY0KClgIC0gR2VuZXJhdGUgcmFuZG9tIFVVSUQqKlxuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2Jyb29mYS9ub2RlLXV1aWQgZm9yIEFQSSBkZXRhaWxzXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICAvLyBEZXByZWNhdGVkIC0gJ2Zvcm1hdCcgYXJndW1lbnQsIGFzIHN1cHBvcnRlZCBpbiB2MS4yXG4gIHZhciBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuXG4gIGlmICh0eXBlb2Yob3B0aW9ucykgPT0gJ3N0cmluZycpIHtcbiAgICBidWYgPSBvcHRpb25zID09ICdiaW5hcnknID8gbmV3IEFycmF5KDE2KSA6IG51bGw7XG4gICAgb3B0aW9ucyA9IG51bGw7XG4gIH1cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdmFyIHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgX3JuZykoKTtcblxuICAvLyBQZXIgNC40LCBzZXQgYml0cyBmb3IgdmVyc2lvbiBhbmQgYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgXG4gIHJuZHNbNl0gPSAocm5kc1s2XSAmIDB4MGYpIHwgMHg0MDtcbiAgcm5kc1s4XSA9IChybmRzWzhdICYgMHgzZikgfCAweDgwO1xuXG4gIC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuICBpZiAoYnVmKSB7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IDE2OyBpaSsrKSB7XG4gICAgICBidWZbaSArIGlpXSA9IHJuZHNbaWldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWYgfHwgdW5wYXJzZShybmRzKTtcbn1cblxuLy8gRXhwb3J0IHB1YmxpYyBBUElcbnZhciB1dWlkID0gdjQ7XG51dWlkLnYxID0gdjE7XG51dWlkLnY0ID0gdjQ7XG51dWlkLnBhcnNlID0gcGFyc2U7XG51dWlkLnVucGFyc2UgPSB1bnBhcnNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHV1aWQ7XG4iLCJcbi8qXG5cbkJhc2ljIG1vZGVsIG9mIGFuIGluZGl2aWR1YWwgYmlyZCAod2hvb3BpbmcgY3JhbmUpLlxuXG5odHRwczovL2dpdGh1Yi5jb20vTmljTWNQaGVlL3dob29waW5nLWNyYW5lLW1vZGVsXG5cbkNvcHlyaWdodCAoYykgMjAxNSBOaWMgTWNQaGVlXG5MaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG4gIHZhciBCaXJkLCBDbG9jaztcblxuICBDbG9jayA9IHJlcXVpcmUoJy4vY2xvY2snKTtcblxuICBCaXJkID0gKGZ1bmN0aW9uKCkge1xuICAgIEJpcmQudXVpZEZhY3RvcnkgPSByZXF1aXJlKCd1dWlkJyk7XG5cbiAgICBCaXJkLnBhaXJpbmdBZ2UgPSA0O1xuXG4gICAgQmlyZC5uZXN0aW5nUHJvYmFiaWxpdHkgPSAwLjU7XG5cbiAgICBCaXJkLmNvbGxlY3Rpb25Qcm9iYWJpbGl0eSA9IDAuNTtcblxuICAgIEJpcmQucmVsZWFzZUNvdW50ID0gNjtcblxuICAgIEJpcmQuZWdnQ29udmVyc2lvblJhdGUgPSAwLjU7XG5cbiAgICBCaXJkLm11dGF0aW9uUmF0ZSA9IDAuMDAxO1xuXG4gICAgQmlyZC5maXJzdFllYXJNb3J0YWxpdHlSYXRlID0gMC42O1xuXG4gICAgQmlyZC5tYXR1cmVNb3J0YWxpdHlSYXRlID0gMC4xO1xuXG4gICAgQmlyZC5FQVJMWSA9IDA7XG5cbiAgICBCaXJkLkxBVEUgPSAxO1xuXG4gICAgQmlyZC5XSUxEX1JFQVJFRCA9IDI7XG5cbiAgICBCaXJkLkNBUFRJVkVfUkVBUkVEID0gMztcblxuICAgIGZ1bmN0aW9uIEJpcmQoX25lc3RpbmdQcmVmZXJlbmNlLCBfaG93UmVhcmVkKSB7XG4gICAgICB0aGlzLl9uZXN0aW5nUHJlZmVyZW5jZSA9IF9uZXN0aW5nUHJlZmVyZW5jZTtcbiAgICAgIHRoaXMuX2hvd1JlYXJlZCA9IF9ob3dSZWFyZWQ7XG4gICAgICB0aGlzLmJpcnRoWWVhciA9IENsb2NrLmN1cnJlbnRZZWFyO1xuICAgICAgdGhpcy51dWlkID0gQmlyZC51dWlkRmFjdG9yeS52NCgpO1xuICAgICAgaWYgKHRoaXMuX25lc3RpbmdQcmVmZXJlbmNlID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fbmVzdGluZ1ByZWZlcmVuY2UgPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gQmlyZC5FQVJMWSA6IEJpcmQuTEFURTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBCaXJkLmZyb21OZXN0ID0gZnVuY3Rpb24obmVzdCwgaG93UmVhcmVkKSB7XG4gICAgICB2YXIgYmFieVByZWZlcmVuY2UsIGZpcnN0UGFyZW50LCBzZWNvbmRQYXJlbnQ7XG4gICAgICBmaXJzdFBhcmVudCA9IG5lc3QuYnVpbGRlcnMoKVswXTtcbiAgICAgIHNlY29uZFBhcmVudCA9IG5lc3QuYnVpbGRlcnMoKVsxXTtcbiAgICAgIGlmIChmaXJzdFBhcmVudC5uZXN0aW5nUHJlZmVyZW5jZSgpID09PSBzZWNvbmRQYXJlbnQubmVzdGluZ1ByZWZlcmVuY2UoKSkge1xuICAgICAgICBiYWJ5UHJlZmVyZW5jZSA9IGZpcnN0UGFyZW50Lm5lc3RpbmdQcmVmZXJlbmNlKCk7XG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgQmlyZC5tdXRhdGlvblJhdGUpIHtcbiAgICAgICAgICBiYWJ5UHJlZmVyZW5jZSA9IEJpcmQuZmxpcChiYWJ5UHJlZmVyZW5jZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoTWF0aC5yYW5kb20oKSA8IDAuNSkge1xuICAgICAgICBiYWJ5UHJlZmVyZW5jZSA9IEJpcmQuRUFSTFk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiYWJ5UHJlZmVyZW5jZSA9IEJpcmQuTEFURTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgQmlyZChiYWJ5UHJlZmVyZW5jZSwgaG93UmVhcmVkKTtcbiAgICB9O1xuXG4gICAgQmlyZC5wcm90b3R5cGUuYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gQ2xvY2suY3VycmVudFllYXIgLSB0aGlzLmJpcnRoWWVhcjtcbiAgICB9O1xuXG4gICAgQmlyZC5wcm90b3R5cGUuY2FuTWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuYWdlKCkgPj0gQmlyZC5wYWlyaW5nQWdlO1xuICAgIH07XG5cbiAgICBCaXJkLnByb3RvdHlwZS5uZXN0aW5nUHJlZmVyZW5jZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX25lc3RpbmdQcmVmZXJlbmNlO1xuICAgIH07XG5cbiAgICBCaXJkLnByb3RvdHlwZS5pc0Vhcmx5ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbmVzdGluZ1ByZWZlcmVuY2UgPT09IEJpcmQuRUFSTFk7XG4gICAgfTtcblxuICAgIEJpcmQucHJvdG90eXBlLmlzTGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX25lc3RpbmdQcmVmZXJlbmNlID09PSBCaXJkLkxBVEU7XG4gICAgfTtcblxuICAgIEJpcmQucHJvdG90eXBlLmhvd1JlYXJlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2hvd1JlYXJlZDtcbiAgICB9O1xuXG4gICAgQmlyZC5wcm90b3R5cGUuaXNDYXB0aXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5faG93UmVhcmVkID09PSBCaXJkLkNBUFRJVkVfUkVBUkVEO1xuICAgIH07XG5cbiAgICBCaXJkLnByb3RvdHlwZS5pc1dpbGQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9ob3dSZWFyZWQgPT09IEJpcmQuV0lMRF9SRUFSRUQ7XG4gICAgfTtcblxuICAgIEJpcmQuZmxpcCA9IGZ1bmN0aW9uKHByZWZlcmVuY2UpIHtcbiAgICAgIGlmIChwcmVmZXJlbmNlID09PSBCaXJkLkVBUkxZKSB7XG4gICAgICAgIHJldHVybiBCaXJkLkxBVEU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gQmlyZC5FQVJMWTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQmlyZC5wcm90b3R5cGUuc3Vydml2ZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBtb3J0YWxpdHk7XG4gICAgICBtb3J0YWxpdHkgPSBCaXJkLm1hdHVyZU1vcnRhbGl0eVJhdGU7XG4gICAgICBpZiAodGhpcy5hZ2UoKSA9PT0gMCkge1xuICAgICAgICBtb3J0YWxpdHkgPSBCaXJkLmZpcnN0WWVhck1vcnRhbGl0eVJhdGU7XG4gICAgICB9XG4gICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSA+PSBtb3J0YWxpdHk7XG4gICAgfTtcblxuICAgIHJldHVybiBCaXJkO1xuXG4gIH0pKCk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBCaXJkO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiXG4vKlxuXG5UaGUgZ2xvYmFsIGNsb2NrIGZvciB0aGUgc2ltdWxhdGlvbiB0aGF0IGtub3dzIHdoYXRcbnllYXIgaXQgaXMgaW4gdGhlIHNpbXVsYXRpb24uXG5cbmh0dHBzOi8vZ2l0aHViLmNvbS9OaWNNY1BoZWUvd2hvb3BpbmctY3JhbmUtbW9kZWxcblxuQ29weXJpZ2h0IChjKSAyMDE1IE5pYyBNY1BoZWVcbkxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgdmFyIENsb2NrO1xuXG4gIENsb2NrID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIENsb2NrKCkge31cblxuICAgIENsb2NrLmN1cnJlbnRZZWFyID0gMDtcblxuICAgIENsb2NrLnJlc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50WWVhciA9IDA7XG4gICAgfTtcblxuICAgIENsb2NrLmluY3JlbWVudFllYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRZZWFyID0gdGhpcy5jdXJyZW50WWVhciArIDE7XG4gICAgfTtcblxuICAgIENsb2NrLnNldFllYXIgPSBmdW5jdGlvbih5ZWFyKSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50WWVhciA9IHllYXI7XG4gICAgfTtcblxuICAgIHJldHVybiBDbG9jaztcblxuICB9KSgpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gQ2xvY2s7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCJcbi8qXG5cbkJhc2ljIG1vZGVsIG9mIGFuIG5lc3QuXG5cbmh0dHBzOi8vZ2l0aHViLmNvbS9OaWNNY1BoZWUvd2hvb3BpbmctY3JhbmUtbW9kZWxcblxuQ29weXJpZ2h0IChjKSAyMDE1IE5pYyBNY1BoZWVcbkxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgdmFyIEJpcmQsIE5lc3Q7XG5cbiAgQmlyZCA9IHJlcXVpcmUoJy4uL2xpYi9iaXJkJyk7XG5cbiAgTmVzdCA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBOZXN0KF9idWlsZGVycykge1xuICAgICAgdmFyIGZpcnN0UGFyZW50LCBzZWNvbmRQYXJlbnQ7XG4gICAgICB0aGlzLl9idWlsZGVycyA9IF9idWlsZGVycztcbiAgICAgIGZpcnN0UGFyZW50ID0gdGhpcy5fYnVpbGRlcnNbMF07XG4gICAgICBzZWNvbmRQYXJlbnQgPSB0aGlzLl9idWlsZGVyc1sxXTtcbiAgICAgIGlmIChmaXJzdFBhcmVudC5uZXN0aW5nUHJlZmVyZW5jZSgpID09PSBzZWNvbmRQYXJlbnQubmVzdGluZ1ByZWZlcmVuY2UoKSkge1xuICAgICAgICB0aGlzLl9uZXN0aW5nVGltZSA9IGZpcnN0UGFyZW50Lm5lc3RpbmdQcmVmZXJlbmNlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9uZXN0aW5nVGltZSA9IEJpcmQuRUFSTFk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgTmVzdC5wcm90b3R5cGUuYnVpbGRlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9idWlsZGVycztcbiAgICB9O1xuXG4gICAgTmVzdC5wcm90b3R5cGUubmVzdGluZ1RpbWUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9uZXN0aW5nVGltZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIE5lc3Q7XG5cbiAgfSkoKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IE5lc3Q7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCJcbi8qXG5cbkJhc2ljIG1vZGVsIG9mIGEgcG9wdWxhdGlvbidzIGNvbGxlY3Rpb24gb2YgbmVzdHMuXG5cbmh0dHBzOi8vZ2l0aHViLmNvbS9OaWNNY1BoZWUvd2hvb3BpbmctY3JhbmUtbW9kZWxcblxuQ29weXJpZ2h0IChjKSAyMDE1IE5pYyBNY1BoZWVcbkxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgdmFyIEJpcmQsIE5lc3QsIE5lc3RpbmcsIHNodWZmbGUsXG4gICAgX19pbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbihpdGVtKSB7IGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHsgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSByZXR1cm4gaTsgfSByZXR1cm4gLTE7IH07XG5cbiAgQmlyZCA9IHJlcXVpcmUoJy4uL2xpYi9iaXJkJyk7XG5cbiAgTmVzdCA9IHJlcXVpcmUoJy4uL2xpYi9uZXN0Jyk7XG5cbiAgc2h1ZmZsZSA9IGZ1bmN0aW9uKGEpIHtcbiAgICB2YXIgaSwgaiwgdDtcbiAgICBpID0gYS5sZW5ndGg7XG4gICAgd2hpbGUgKC0taSA+IDApIHtcbiAgICAgIGogPSB+fihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG4gICAgICB0ID0gYVtqXTtcbiAgICAgIGFbal0gPSBhW2ldO1xuICAgICAgYVtpXSA9IHQ7XG4gICAgfVxuICAgIHJldHVybiBhO1xuICB9O1xuXG4gIE5lc3RpbmcgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gTmVzdGluZyhtYXRpbmdQYWlycykge1xuICAgICAgdmFyIG5lc3RpbmdQYWlycywgcDtcbiAgICAgIG5lc3RpbmdQYWlycyA9IG1hdGluZ1BhaXJzLmZpbHRlcihmdW5jdGlvbihwcikge1xuICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSA8IEJpcmQubmVzdGluZ1Byb2JhYmlsaXR5O1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9hY3RpdmVOZXN0cyA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9pLCBfbGVuLCBfcmVzdWx0cztcbiAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBuZXN0aW5nUGFpcnMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBwID0gbmVzdGluZ1BhaXJzW19pXTtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKG5ldyBOZXN0KHApKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICB9KSgpO1xuICAgICAgdGhpcy5fY29sbGVjdGVkTmVzdHMgPSBbXTtcbiAgICAgIHRoaXMuX3JlbGVhc2VkTmVzdHMgPSBbXTtcbiAgICAgIHRoaXMuX2FiYW5kb25lZE5lc3RzID0gW107XG4gICAgfVxuXG4gICAgTmVzdGluZy5wcm90b3R5cGUuYWN0aXZlTmVzdHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hY3RpdmVOZXN0cztcbiAgICB9O1xuXG4gICAgTmVzdGluZy5wcm90b3R5cGUuY29sbGVjdGVkTmVzdHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jb2xsZWN0ZWROZXN0cztcbiAgICB9O1xuXG4gICAgTmVzdGluZy5wcm90b3R5cGUucmVsZWFzZWROZXN0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlbGVhc2VkTmVzdHM7XG4gICAgfTtcblxuICAgIE5lc3RpbmcucHJvdG90eXBlLmFiYW5kb25lZE5lc3RzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYWJhbmRvbmVkTmVzdHM7XG4gICAgfTtcblxuICAgIE5lc3RpbmcucHJvdG90eXBlLmNvbGxlY3RFZ2dzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZWFybHlOZXN0cywgbnVtVG9Db2xsZWN0O1xuICAgICAgZWFybHlOZXN0cyA9IHRoaXMuX2FjdGl2ZU5lc3RzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLm5lc3RpbmdUaW1lKCkgPT09IEJpcmQuRUFSTFk7XG4gICAgICB9KTtcbiAgICAgIHNodWZmbGUoZWFybHlOZXN0cyk7XG4gICAgICBudW1Ub0NvbGxlY3QgPSBNYXRoLmZsb29yKGVhcmx5TmVzdHMubGVuZ3RoICogQmlyZC5jb2xsZWN0aW9uUHJvYmFiaWxpdHkpO1xuICAgICAgdGhpcy5fY29sbGVjdGVkTmVzdHMgPSBlYXJseU5lc3RzLnNsaWNlKDAsIG51bVRvQ29sbGVjdCk7XG4gICAgICB0aGlzLl9hY3RpdmVOZXN0cyA9IHRoaXMuX2FjdGl2ZU5lc3RzLmZpbHRlcigoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgICByZXR1cm4gX19pbmRleE9mLmNhbGwoX3RoaXMuX2NvbGxlY3RlZE5lc3RzLCBuKSA8IDA7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICByZXR1cm4gdGhpcy5fcmVsZWFzZWROZXN0cyA9IHRoaXMuX2NvbGxlY3RlZE5lc3RzLnNsaWNlKDAsIEJpcmQucmVsZWFzZUNvdW50KTtcbiAgICB9O1xuXG4gICAgTmVzdGluZy5wcm90b3R5cGUuYWJhbmRvbk5lc3RzID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9hYmFuZG9uZWROZXN0cyA9IHRoaXMuX2FjdGl2ZU5lc3RzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLm5lc3RpbmdUaW1lKCkgPT09IEJpcmQuRUFSTFk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzLl9hY3RpdmVOZXN0cyA9IHRoaXMuX2FjdGl2ZU5lc3RzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLm5lc3RpbmdUaW1lKCkgPT09IEJpcmQuTEFURTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBOZXN0aW5nLnByb3RvdHlwZS5oYXRjaE5lc3RzID0gZnVuY3Rpb24oYmlyZFR5cGUsIG5lc3RzKSB7XG4gICAgICB2YXIgbmVzdCwgX2ksIF9sZW4sIF9yZXN1bHRzO1xuICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gbmVzdHMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgbmVzdCA9IG5lc3RzW19pXTtcbiAgICAgICAgX3Jlc3VsdHMucHVzaChCaXJkLmZyb21OZXN0KG5lc3QsIGJpcmRUeXBlKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfTtcblxuICAgIE5lc3RpbmcucHJvdG90eXBlLmhhdGNoRWdncyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGhhdGNoZWRXaWxkTmVzdHMsIG5ld0NhcHRpdmVCaXJkcywgbmV3V2lsZEJpcmRzO1xuICAgICAgaGF0Y2hlZFdpbGROZXN0cyA9IHRoaXMuX2FjdGl2ZU5lc3RzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpIDwgQmlyZC5lZ2dDb252ZXJzaW9uUmF0ZTtcbiAgICAgIH0pO1xuICAgICAgbmV3V2lsZEJpcmRzID0gdGhpcy5oYXRjaE5lc3RzKEJpcmQuV0lMRF9SRUFSRUQsIGhhdGNoZWRXaWxkTmVzdHMpO1xuICAgICAgbmV3Q2FwdGl2ZUJpcmRzID0gdGhpcy5oYXRjaE5lc3RzKEJpcmQuQ0FQVElWRV9SRUFSRUQsIHRoaXMuX3JlbGVhc2VkTmVzdHMpO1xuICAgICAgcmV0dXJuIG5ld1dpbGRCaXJkcy5jb25jYXQobmV3Q2FwdGl2ZUJpcmRzKTtcbiAgICB9O1xuXG4gICAgTmVzdGluZy5wcm90b3R5cGUucmVwcm9kdWN0aW9uQ3ljbGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuY29sbGVjdEVnZ3MoKTtcbiAgICAgIHRoaXMuYWJhbmRvbk5lc3RzKCk7XG4gICAgICByZXR1cm4gdGhpcy5oYXRjaEVnZ3MoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIE5lc3Rpbmc7XG5cbiAgfSkoKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IE5lc3Rpbmc7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCJcbi8qXG5cbkJhc2ljIG1vZGVsIG9mIGEgcG9wdWxhdGlvbiBvZiBiaXJkcyAod2hvb3BpbmcgY3JhbmVzKS5cblxuaHR0cHM6Ly9naXRodWIuY29tL05pY01jUGhlZS93aG9vcGluZy1jcmFuZS1tb2RlbFxuXG5Db3B5cmlnaHQgKGMpIDIwMTUgTmljIE1jUGhlZVxuTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgQmlyZCwgUG9wdWxhdGlvbiwgY2h1bmssIHNodWZmbGUsXG4gICAgX19pbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbihpdGVtKSB7IGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHsgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSByZXR1cm4gaTsgfSByZXR1cm4gLTE7IH07XG5cbiAgQmlyZCA9IHJlcXVpcmUoJy4vYmlyZCcpO1xuXG4gIHNodWZmbGUgPSBmdW5jdGlvbihhKSB7XG4gICAgdmFyIGksIGosIHQ7XG4gICAgaSA9IGEubGVuZ3RoO1xuICAgIHdoaWxlICgtLWkgPiAwKSB7XG4gICAgICBqID0gfn4oTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgICAgdCA9IGFbal07XG4gICAgICBhW2pdID0gYVtpXTtcbiAgICAgIGFbaV0gPSB0O1xuICAgIH1cbiAgICByZXR1cm4gYTtcbiAgfTtcblxuICBjaHVuayA9IGZ1bmN0aW9uKGFycmF5LCBjaHVua1NpemUpIHtcbiAgICByZXR1cm4gW10uY29uY2F0LmFwcGx5KFtdLCBhcnJheS5tYXAoZnVuY3Rpb24oZWxlbSwgaSkge1xuICAgICAgaWYgKGkgJSBjaHVua1NpemUpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFthcnJheS5zbGljZShpLCBpICsgY2h1bmtTaXplKV07XG4gICAgICB9XG4gICAgfSkpO1xuICB9O1xuXG4gIFBvcHVsYXRpb24gPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gUG9wdWxhdGlvbihwb3BTaXplKSB7XG4gICAgICB0aGlzLl91bnBhaXJlZEJpcmRzID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX2ksIF9yZXN1bHRzO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKF9pID0gMDsgMCA8PSBwb3BTaXplID8gX2kgPCBwb3BTaXplIDogX2kgPiBwb3BTaXplOyAwIDw9IHBvcFNpemUgPyBfaSsrIDogX2ktLSkge1xuICAgICAgICAgIF9yZXN1bHRzLnB1c2gobmV3IEJpcmQoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfSkoKTtcbiAgICAgIHRoaXMuX3BhaXJpbmdzID0gW107XG4gICAgfVxuXG4gICAgUG9wdWxhdGlvbi5wcm90b3R5cGUuYWRkQmlyZCA9IGZ1bmN0aW9uKGJpcmQpIHtcbiAgICAgIGlmIChiaXJkID09IG51bGwpIHtcbiAgICAgICAgYmlyZCA9IG5ldyBCaXJkKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fdW5wYWlyZWRCaXJkcy5wdXNoKGJpcmQpO1xuICAgIH07XG5cbiAgICBQb3B1bGF0aW9uLnByb3RvdHlwZS5iaXJkcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3VucGFpcmVkQmlyZHMuY29uY2F0KFtdLmNvbmNhdC5hcHBseShbXSwgdGhpcy5fcGFpcmluZ3MpKTtcbiAgICB9O1xuXG4gICAgUG9wdWxhdGlvbi5wcm90b3R5cGUudW5wYWlyZWRCaXJkcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3VucGFpcmVkQmlyZHM7XG4gICAgfTtcblxuICAgIFBvcHVsYXRpb24ucHJvdG90eXBlLm1hdGluZ1BhaXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcGFpcmluZ3M7XG4gICAgfTtcblxuICAgIFBvcHVsYXRpb24ucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl91bnBhaXJlZEJpcmRzLmxlbmd0aCArIDIgKiB0aGlzLl9wYWlyaW5ncy5sZW5ndGg7XG4gICAgfTtcblxuICAgIFBvcHVsYXRpb24ucHJvdG90eXBlLm1hdGVVbnBhaXJlZEJpcmRzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdG9NYXRlO1xuICAgICAgdG9NYXRlID0gdGhpcy5fdW5wYWlyZWRCaXJkcy5maWx0ZXIoZnVuY3Rpb24oYikge1xuICAgICAgICByZXR1cm4gYi5jYW5NYXRlKCk7XG4gICAgICB9KTtcbiAgICAgIGlmICh0b01hdGUubGVuZ3RoICUgMiA9PT0gMSkge1xuICAgICAgICB0b01hdGUgPSB0b01hdGUuc2xpY2UoMSk7XG4gICAgICB9XG4gICAgICBzaHVmZmxlKHRvTWF0ZSk7XG4gICAgICB0aGlzLl91bnBhaXJlZEJpcmRzID0gdGhpcy5fdW5wYWlyZWRCaXJkcy5maWx0ZXIoZnVuY3Rpb24oYikge1xuICAgICAgICByZXR1cm4gIShfX2luZGV4T2YuY2FsbCh0b01hdGUsIGIpID49IDApO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcy5fcGFpcmluZ3MgPSB0aGlzLl9wYWlyaW5ncy5jb25jYXQoY2h1bmsodG9NYXRlLCAyKSk7XG4gICAgfTtcblxuICAgIFBvcHVsYXRpb24ucHJvdG90eXBlLm1vcnRhbGl0eVBhc3MgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwYWlyLCBzdXJ2aXZpbmdQYWlycywgc3Vydml2b3JzLCBfaSwgX2xlbiwgX3JlZjtcbiAgICAgIHRoaXMuX3VucGFpcmVkQmlyZHMgPSB0aGlzLl91bnBhaXJlZEJpcmRzLmZpbHRlcihmdW5jdGlvbihiKSB7XG4gICAgICAgIHJldHVybiBiLnN1cnZpdmVzKCk7XG4gICAgICB9KTtcbiAgICAgIHN1cnZpdmluZ1BhaXJzID0gW107XG4gICAgICBfcmVmID0gdGhpcy5fcGFpcmluZ3M7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgcGFpciA9IF9yZWZbX2ldO1xuICAgICAgICBzdXJ2aXZvcnMgPSBwYWlyLmZpbHRlcihmdW5jdGlvbihiKSB7XG4gICAgICAgICAgcmV0dXJuIGIuc3Vydml2ZXMoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChzdXJ2aXZvcnMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgc3Vydml2aW5nUGFpcnMucHVzaChwYWlyKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdXJ2aXZvcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgdGhpcy5fdW5wYWlyZWRCaXJkcy5wdXNoKHN1cnZpdm9yc1swXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9wYWlyaW5ncyA9IHN1cnZpdmluZ1BhaXJzO1xuICAgIH07XG5cbiAgICBQb3B1bGF0aW9uLnByb3RvdHlwZS5jYXBUb0NhcnJ5aW5nQ2FwYWNpdHkgPSBmdW5jdGlvbigpIHt9O1xuXG4gICAgcmV0dXJuIFBvcHVsYXRpb247XG5cbiAgfSkoKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IFBvcHVsYXRpb247XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgdmFyIFBvcHVsYXRpb24sIFJpY2tzaGF3U3RyaXBDaGFydCwgU2ltdWxhdG9yLFxuICAgIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH07XG5cbiAgU2ltdWxhdG9yID0gcmVxdWlyZSgnLi9zaW11bGF0b3InKTtcblxuICBQb3B1bGF0aW9uID0gcmVxdWlyZSgnLi9wb3B1bGF0aW9uJyk7XG5cbiAgUmlja3NoYXdTdHJpcENoYXJ0ID0gKGZ1bmN0aW9uKCkge1xuICAgIFJpY2tzaGF3U3RyaXBDaGFydC5wcm90b3R5cGUudmFsdWVzID0gbnVsbDtcblxuICAgIFJpY2tzaGF3U3RyaXBDaGFydC5wcm90b3R5cGUueWVhciA9IDIwMTU7XG5cbiAgICBSaWNrc2hhd1N0cmlwQ2hhcnQucHJvdG90eXBlLm51bVllYXJzID0gMTAwO1xuXG4gICAgUmlja3NoYXdTdHJpcENoYXJ0LnByb3RvdHlwZS5ydW5OdW1iZXIgPSAwO1xuXG4gICAgUmlja3NoYXdTdHJpcENoYXJ0LnByb3RvdHlwZS5udW1SdW5zID0gNTA7XG5cbiAgICBSaWNrc2hhd1N0cmlwQ2hhcnQucHJvdG90eXBlLnRpY2tMZW5ndGggPSAxO1xuXG4gICAgUmlja3NoYXdTdHJpcENoYXJ0LnByb3RvdHlwZS5pc1J1bm5pbmcgPSBmYWxzZTtcblxuICAgIFJpY2tzaGF3U3RyaXBDaGFydC5wcm90b3R5cGUuaGFzU3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgUmlja3NoYXdTdHJpcENoYXJ0LnByb3RvdHlwZS5ub3REb25lID0gdHJ1ZTtcblxuICAgIGZ1bmN0aW9uIFJpY2tzaGF3U3RyaXBDaGFydCgpIHtcbiAgICAgIHRoaXMudGljayA9IF9fYmluZCh0aGlzLnRpY2ssIHRoaXMpO1xuICAgICAgdGhpcy52YWx1ZXMgPSBbXTtcbiAgICAgIHRoaXMuYnVpbGRDaGFydCgpO1xuICAgICAgJChcIiNzdGFydF9idXR0b25cIikuY2xpY2soKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMudG9nZ2xlX3J1bm5pbmcoKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICB9XG5cbiAgICBSaWNrc2hhd1N0cmlwQ2hhcnQucHJvdG90eXBlLnRvZ2dsZV9ydW5uaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmlzUnVubmluZyA9ICF0aGlzLmlzUnVubmluZztcbiAgICAgIGlmICghdGhpcy5oYXNTdGFydGVkKSB7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmlzUnVubmluZyAmJiB0aGlzLm5vdERvbmUpIHtcbiAgICAgICAgJChcIiNzdGFydF9idXR0b25cIikudGV4dChcIlN0b3BcIik7XG4gICAgICAgIHJldHVybiB0aGlzLnRpY2soKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAkKFwiI3N0YXJ0X2J1dHRvblwiKS50ZXh0KFwiU3RhcnRcIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIFJpY2tzaGF3U3RyaXBDaGFydC5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuaW5pdGlhbE51bUNyYW5lcyA9IE51bWJlcigkKFwiI251bV9jcmFuZXNcIikudmFsKCkpO1xuICAgICAgdGhpcy52YWx1ZXMubGVuZ3RoID0gMDtcbiAgICAgIHRoaXMucnVuTnVtYmVyID0gMDtcbiAgICAgIHRoaXMuaGFzU3RhcnRlZCA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcy5ub3REb25lID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgUmlja3NoYXdTdHJpcENoYXJ0LnByb3RvdHlwZS5idWlsZENoYXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaG92ZXJEZXRhaWwsIHhBeGlzLCB4X2F4aXMsIHlBeGlzLCB5X2F4aXM7XG4gICAgICB0aGlzLmNoYXJ0ID0gbmV3IFJpY2tzaGF3LkdyYXBoKHtcbiAgICAgICAgZWxlbWVudDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXJ0JyksXG4gICAgICAgIHdpZHRoOiA4MDAsXG4gICAgICAgIGhlaWdodDogMzAwLFxuICAgICAgICByZW5kZXJlcjogJ2xpbmUnLFxuICAgICAgICBzZXJpZXM6IHRoaXMudmFsdWVzLFxuICAgICAgICBtaW46IC01MFxuICAgICAgfSk7XG4gICAgICB4QXhpcyA9IG5ldyBSaWNrc2hhdy5HcmFwaC5BeGlzLlgoe1xuICAgICAgICBncmFwaDogdGhpcy5jaGFydFxuICAgICAgfSk7XG4gICAgICB5QXhpcyA9IG5ldyBSaWNrc2hhdy5HcmFwaC5BeGlzLlkoe1xuICAgICAgICBncmFwaDogdGhpcy5jaGFydFxuICAgICAgfSk7XG4gICAgICBob3ZlckRldGFpbCA9IG5ldyBSaWNrc2hhdy5HcmFwaC5Ib3ZlckRldGFpbCh7XG4gICAgICAgIGdyYXBoOiB0aGlzLmNoYXJ0LFxuICAgICAgICB4Rm9ybWF0dGVyOiBmdW5jdGlvbih5ZWFyKSB7XG4gICAgICAgICAgcmV0dXJuIFwiWWVhciBcIiArIHllYXI7XG4gICAgICAgIH0sXG4gICAgICAgIHlGb3JtYXR0ZXI6IGZ1bmN0aW9uKG51bUNyYW5lcykge1xuICAgICAgICAgIHJldHVybiBcIlwiICsgKE1hdGgucm91bmQobnVtQ3JhbmVzKSkgKyBcIiBjcmFuZXNcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB4X2F4aXMgPSBuZXcgUmlja3NoYXcuR3JhcGguQXhpcy5YKHtcbiAgICAgICAgZ3JhcGg6IHRoaXMuY2hhcnRcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHlfYXhpcyA9IG5ldyBSaWNrc2hhdy5HcmFwaC5BeGlzLlkoe1xuICAgICAgICBncmFwaDogdGhpcy5jaGFydFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIFJpY2tzaGF3U3RyaXBDaGFydC5wcm90b3R5cGUuZHJhd0NoYXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFydC5yZW5kZXIoKTtcbiAgICB9O1xuXG4gICAgUmlja3NoYXdTdHJpcENoYXJ0LnByb3RvdHlwZS5leHRlbmREYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZW50cmllcywgZW50cnksIHBvcFNpemUsIHBvcHVsYXRpb24sIHNpbXVsYXRvciwgeWVhciwgeWVhcnMsIF9pLCBfaiwgX2xlbiwgX3JlZiwgX3JlZjEsIF9yZXN1bHRzO1xuICAgICAgeWVhcnMgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gX3JlZiA9IHRoaXMueWVhciwgX3JlZjEgPSB0aGlzLnllYXIgKyB0aGlzLm51bVllYXJzOyBfcmVmIDw9IF9yZWYxID8gX2kgPCBfcmVmMSA6IF9pID4gX3JlZjE7IF9yZWYgPD0gX3JlZjEgPyBfaSsrIDogX2ktLSl7IF9yZXN1bHRzLnB1c2goX2kpOyB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgIH0pLmFwcGx5KHRoaXMpO1xuICAgICAgcG9wdWxhdGlvbiA9IG5ldyBQb3B1bGF0aW9uKHRoaXMuaW5pdGlhbE51bUNyYW5lcyk7XG4gICAgICBzaW11bGF0b3IgPSBuZXcgU2ltdWxhdG9yKHBvcHVsYXRpb24pO1xuICAgICAgZW50cmllcyA9IFtdO1xuICAgICAgZm9yIChfaiA9IDAsIF9sZW4gPSB5ZWFycy5sZW5ndGg7IF9qIDwgX2xlbjsgX2orKykge1xuICAgICAgICB5ZWFyID0geWVhcnNbX2pdO1xuICAgICAgICBwb3BTaXplID0gc2ltdWxhdG9yLmdldFBvcHVsYXRpb24oKS5iaXJkcygpLmxlbmd0aDtcbiAgICAgICAgZW50cnkgPSB7XG4gICAgICAgICAgeDogeWVhcixcbiAgICAgICAgICB5OiBwb3BTaXplXG4gICAgICAgIH07XG4gICAgICAgIGVudHJpZXMucHVzaChlbnRyeSk7XG4gICAgICAgIGlmIChwb3BTaXplIDw9IDApIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBzaW11bGF0b3IuYWR2YW5jZU9uZVllYXIoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnZhbHVlcy5wdXNoKHtcbiAgICAgICAgbmFtZTogXCJSdW4gI1wiICsgdGhpcy5ydW5OdW1iZXIsXG4gICAgICAgIGNvbG9yOiBcInJnYmEoMCwgMCwgMCwgMC4xKVwiLFxuICAgICAgICBkYXRhOiBlbnRyaWVzXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgUmlja3NoYXdTdHJpcENoYXJ0LnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmV4dGVuZERhdGEoKTtcbiAgICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gICAgICB0aGlzLnJ1bk51bWJlciA9IHRoaXMucnVuTnVtYmVyICsgMTtcbiAgICAgIHRoaXMubm90RG9uZSA9IHRoaXMucnVuTnVtYmVyIDwgdGhpcy5udW1SdW5zO1xuICAgICAgaWYgKCF0aGlzLm5vdERvbmUpIHtcbiAgICAgICAgdGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5oYXNTdGFydGVkID0gZmFsc2U7XG4gICAgICAgICQoXCIjc3RhcnRfYnV0dG9uXCIpLnRleHQoXCJSZXN0YXJ0XCIpO1xuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coXCJSdW4gbnVtYmVyIFwiICsgdGhpcy5ydW5OdW1iZXIgKyBcIiwgbGVuIHZhbHMgPSBcIiArIHRoaXMudmFsdWVzLmxlbmd0aCk7XG4gICAgICBpZiAodGhpcy5pc1J1bm5pbmcgJiYgdGhpcy5ub3REb25lKSB7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KHRoaXMudGljaywgdGhpcy50aWNrTGVuZ3RoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIFJpY2tzaGF3U3RyaXBDaGFydDtcblxuICB9KSgpO1xuXG4gIHdpbmRvdy5SaWNrc2hhd1N0cmlwQ2hhcnQgPSBSaWNrc2hhd1N0cmlwQ2hhcnQ7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCJcbi8qXG5cbkJhc2ljIHNpbXVsYXRvciB0aGF0J3MgaW4gY2hhcmdlIG9mIHJ1bm5pbmcgdGhyb3VnaFxudGhlIGV2ZW50cyBmb3IgYSB5ZWFyLCBhbmQgdGhlbiBydW5uaW5nIG11bHRpcGxlXG55ZWFycy5cblxuaHR0cHM6Ly9naXRodWIuY29tL05pY01jUGhlZS93aG9vcGluZy1jcmFuZS1tb2RlbFxuXG5Db3B5cmlnaHQgKGMpIDIwMTUgTmljIE1jUGhlZVxuTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgQ2xvY2ssIE5lc3RpbmcsIFNpbXVsYXRvcjtcblxuICBDbG9jayA9IHJlcXVpcmUoJy4vY2xvY2snKTtcblxuICBOZXN0aW5nID0gcmVxdWlyZSgnLi9uZXN0aW5nJyk7XG5cbiAgU2ltdWxhdG9yID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIFNpbXVsYXRvcihwb3B1bGF0aW9uKSB7XG4gICAgICB0aGlzLnBvcHVsYXRpb24gPSBwb3B1bGF0aW9uO1xuICAgIH1cblxuICAgIFNpbXVsYXRvci5wcm90b3R5cGUuYWR2YW5jZU9uZVllYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBiLCBuZXN0aW5nLCBuZXdCaXJkcywgX2ksIF9sZW47XG4gICAgICBDbG9jay5pbmNyZW1lbnRZZWFyKCk7XG4gICAgICB0aGlzLnBvcHVsYXRpb24ubWF0ZVVucGFpcmVkQmlyZHMoKTtcbiAgICAgIG5lc3RpbmcgPSBuZXcgTmVzdGluZyh0aGlzLnBvcHVsYXRpb24ubWF0aW5nUGFpcnMoKSk7XG4gICAgICBuZXdCaXJkcyA9IG5lc3RpbmcucmVwcm9kdWN0aW9uQ3ljbGUoKTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gbmV3QmlyZHMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgYiA9IG5ld0JpcmRzW19pXTtcbiAgICAgICAgdGhpcy5wb3B1bGF0aW9uLmFkZEJpcmQoYik7XG4gICAgICB9XG4gICAgICB0aGlzLnBvcHVsYXRpb24ubW9ydGFsaXR5UGFzcygpO1xuICAgICAgdGhpcy5wb3B1bGF0aW9uLmNhcFRvQ2FycnlpbmdDYXBhY2l0eSgpO1xuICAgIH07XG5cbiAgICBTaW11bGF0b3IucHJvdG90eXBlLmdldFBvcHVsYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnBvcHVsYXRpb247XG4gICAgfTtcblxuICAgIHJldHVybiBTaW11bGF0b3I7XG5cbiAgfSkoKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IFNpbXVsYXRvcjtcblxufSkuY2FsbCh0aGlzKTtcbiIsIlxuLypcblxud2hvb3BpbmctY3JhbmUtbW9kZWxcbmh0dHBzOi8vZ2l0aHViLmNvbS9OaWNNY1BoZWUvd2hvb3BpbmctY3JhbmUtbW9kZWxcblxuQ29weXJpZ2h0IChjKSAyMDE1IE5pYyBNY1BoZWVcbkxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgZXhwb3J0cy5hd2Vzb21lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICdhd2Vzb21lJztcbiAgfTtcblxufSkuY2FsbCh0aGlzKTtcbiJdfQ==
