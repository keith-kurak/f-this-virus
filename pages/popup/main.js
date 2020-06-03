
	window.main_vm = new Vue({

		el: "#root",
		data: {

			active_page_name: "main",
			current_hostname_allowed: false,
      current_hostname: "example.com",
			profanitySliderIndex: 3,
			remindNotResponsible: true,
			fixRacistTerms: true,

    },
    computed: {
      profanityMode: function() {
        switch(parseInt(this.profanitySliderIndex)) {
          case 1:
            return 'Annoying religious dude next door';
          case 2:
            return `Mad as heck, but there's kids around`;
          case 3:
            return 'Just say the F-word, please';
          default: 
            return '???';
        }
			},
			profanityModeDescription: function() {
        switch(parseInt(this.profanitySliderIndex)) {
          case 1:
            return 'Hi-diddily-ho, neighborino!';
          case 2:
            return `Frickin viruses with laser beams on their heads`;
          case 3:
            return 'Tell them how you REALLY feel!';
          default: 
            return '???';
        }
      }
    },
		methods: {

			init: async function ( app ) {

				this.app = app;

				chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

					try {

						if ( tabs[ 0 ].url.indexOf( "https://" ) === 0 || tabs[ 0 ].url.indexOf( "https://" ) === 0 ) {

							this.current_hostname = ( new URL ( tabs[ 0 ].url ) ).hostname;

						} else {

							this.current_hostname = "example.com";

						};

					} catch ( e ) {

						console.log(e);

						this.current_hostname = "example.com";

					};

					chrome.storage.local.get([ this.current_hostname, 'profanityLevel', 'remindNotResponsible', 'fixRacistTerms' ], ( storage ) => {

						this.current_hostname_allowed = storage[ this.current_hostname ];
						this.profanitySliderIndex = storage.profanityLevel === undefined ? 3 : storage.profanityLevel;
						this.remindNotResponsible = storage.remindNotResponsible === undefined ? true : storage.remindNotResponsible;
						this.fixRacistTerms = storage.fixRacistTerms === undefined ? true : storage.fixRacistTerms;
					});

				});

			},

			reload: function () {

				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					chrome.tabs.reload(tabs[0].id);
				});

			},

		},

		watch: {

			current_hostname_allowed: function () {

				var new_storage = {};
				new_storage[ this.current_hostname ] = this.current_hostname_allowed;
				chrome.storage.local.set( new_storage )

      },
      
      profanitySliderIndex: function () {
        const new_storage = {};
				new_storage.profanityLevel = this.profanitySliderIndex;
				chrome.storage.local.set( new_storage )
			},
			
			remindNotResponsible: function() {
				const new_storage = {};
				new_storage.remindNotResponsible = this.remindNotResponsible;
				chrome.storage.local.set( new_storage )
			},

			fixRacistTerms: function() {
				const new_storage = {};
				new_storage.fixRacistTerms = this.fixRacistTerms;
				chrome.storage.local.set( new_storage )
			}

		},

	});

	( function ( x ) {

		var app = {

			name: "iframe",
			x: x,

		};

		window.main_vm.init( app );

	} ( window.webextension_library ) );
