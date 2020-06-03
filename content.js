function isCapitalized(word) {
  return word[0] === word[0].toUpperCase();
}

function capitalizeFirst(s) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

(function() {
  const coronavirusModifiers = {
    1: "ah-hell-diddily-ding-dong-crap",
    2: "frickin",
    3: "fucking"
	};
	
	const racismModifiers = {
    1: "do-diddily-riddily",
    2: "BS",
    3: "bullshit"
  };

	var racistMatches = /(wuhan flu|chinese virus|wuhan virus)/ig;
  var trumpMatches = /([Pp]resident [Oo]f [Tt]he United States|Donald John Trump|[pP]resident Donald Trump|Donald Trump|[mM][rR]\.? Trump|[pP]resident Trump|Donald Trump|US [pP]resident|Donald J\.? Trump|Trump)(?! \(not responsible\))/ig;
  //var trumpPossessiveMatches = /([Pp]resident [Oo]f [Tt]he United States|Donald John Trump|[pP]resident Donald Trump|Donald Trump|[mM][rR]\.? Trump|[pP]resident Trump|Donald Trump|US [pP]resident|Donald J\.? Trump|Trump)'s(?! \(not responsible\))/ig;
  var hostname = null;

  var _priv = {
		profanityLevel: 3,
		remindNotResponsible: true,
		fixRacistTerms: true,
    process_text_node: (node, a, b) => {
      if (node.nodeValue.trim().length === 0) {
        return;
			}
			
			canCapitalizeMatches = new RegExp(`(?<!${coronavirusModifiers[_priv.profanityLevel]} )(coronavirus|corona virus)`, 'ig');
			cantCapitalizeMatches = new RegExp(`(?<!${coronavirusModifiers[_priv.profanityLevel]} )COVID-19`, 'ig');

      if (_priv.fixRacistTerms && node.nodeValue && racistMatches.test(node.nodeValue)) {
        node.nodeValue = node.nodeValue.replace(racistMatches, function(match) {
          return `[${racismModifiers[_priv.profanityLevel]} racist term for coronavirus]`;
        });
			} 
			
			if (node.nodeValue && canCapitalizeMatches.test(node.nodeValue)) {
        node.nodeValue = node.nodeValue.replace(canCapitalizeMatches, function(
          match
        ) {
          if (isCapitalized(match)) {
            return (
              capitalizeFirst(coronavirusModifiers[_priv.profanityLevel]) +
              " " +
              match
            );
          } else {
            return coronavirusModifiers[_priv.profanityLevel] + " " + match;
          }
        });
      } else if (node.nodeValue && cantCapitalizeMatches.test(node.nodeValue)) {
        node.nodeValue = node.nodeValue.replace(cantCapitalizeMatches, function(
          match
        ) {
          return coronavirusModifiers[_priv.profanityLevel] + " " + match;
        });
      }
      
      // couldn't make this work yet
      /*if (_priv.remindNotResponsible && node.nodeValue && trumpPossessiveMatches.test( node.nodeValue ) ) {

				node.nodeValue = node.nodeValue.replace( trumpPossessiveMatches, function(match) {
					return match + ' (not responsible)';
				});

      } else*/
      if (_priv.remindNotResponsible && node.nodeValue && trumpMatches.test( node.nodeValue ) ) {

				node.nodeValue = node.nodeValue.replace( trumpMatches, function(match) {
					return match + ' (not responsible)';
				});

			};
    },

    text_nodes_under: node => {
      var all = [];

      for (
        node =
          node.firstChild || (node.shadowRoot && node.shadowRoot.firstChild);
        node;
        node = node.nextSibling
      ) {
        if (node.nodeType == 3) {
          all.push(node);
        } else {
          all = all.concat(_priv.text_nodes_under(node));
        }
      }

      return all;
    },

    analyze_existing_nodes: () => {
      var node_arr = _priv.text_nodes_under(document);

      for (var i = node_arr.length; i--; ) {
        _priv.process_text_node(node_arr[i], node_arr[i - 1], node_arr[i - 2]);
      }
    },

    add_observers: () => {
      var record;
      var text_node;
      var text_node_arr;

      var observer = new MutationObserver(record_arr => {
        for (var i = record_arr.length; i--; ) {
          record = record_arr[i];

          text_node_arr = _priv.text_nodes_under(record.target);

          if (record.target.nodeType === 3) {
            _priv.process_text_node(record.target);
          } else {
            for (var j = text_node_arr.length; j--; ) {
              _priv.process_text_node(
                text_node_arr[j],
                text_node_arr[j - 1],
                text_node_arr[j - 2]
              );
            }
          }
        }
      });

      observer.observe(document, {
        childList: true,
        subtree: true,
        characterData: false
      });
    },

    start_detecting: () => {
      var observer = new MutationObserver(record_arr => {
        if (document.body) {
          _priv.analyze_existing_nodes();
          observer.disconnect();
        }
      });

      observer.observe(document.documentElement, {
        childList: true
      });

      window.addEventListener("DOMContentLoaded", function() {
        _priv.add_observers();
        _priv.analyze_existing_nodes();
      });
    }
  };

  var _pub = {
    init: app => {
      if (window === window.top) {
        hostname = location.hostname;

        chrome.storage.local.get([hostname, 'profanityLevel', 'fixRacistTerms', 'remindNotResponsible'], storage => {
          if (!!storage[hostname] === false) {
						_priv.profanityLevel = storage.profanityLevel === undefined ? 3 : storage.profanityLevel;
						_priv.remindNotResponsible = storage.remindNotResponsible === undefined ? true : storage.remindNotResponsible;
						_priv.fixRacistTerms = storage.fixRacistTerms === undefined ? true : storage.fixRacistTerms;
            _priv.start_detecting();
            _priv.analyze_existing_nodes();
          }
        });
      }
    }
  };

  _pub.init();
})();
