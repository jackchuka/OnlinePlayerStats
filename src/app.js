var UI = require('ui');
var ajax = require('ajax');

// Construct URL
var statsURLs = [
	'http://api.swbstats.com/api/onlinePlayers/',
	'http://api.bf4stats.com/api/onlinePlayers/',
	'http://api.bf3stats.com/global/onlinestats/',
	'http://api.bfhstats.com/api/onlinePlayers/'
];

var detailView;

var menu = new UI.Menu({
	backgroundColor: 'black',
	textColor: 'orange',
	highlightBackgroundColor: 'orange',
	highlightTextColor: 'black',
	sections: [{
		title: 'Online Player Stats',
		items: [
			{
				title: 'Battlefront'
			},
			{
				title: 'Battlefield 4'
			},
			{
				title: 'Battlefield 3'
			},
			{
				title: 'Battlefield',
				subtitle: 'Hardline'
			},
		]
	}]
});

menu.show();


menu.on('select', function(e) {
	getDetailView(e);
});
			   
function getDetailView(e) {
			   
	var splashScreen = new UI.Card({ title: 'Loading...', subtitle: 'Shake to refresh' });
	splashScreen.show();
			   
	ajax({
		url: statsURLs[e.itemIndex],
		type: 'json'
	}, function(data) {
	
		splashScreen.hide();
		var details = [];
		
		console.log(e.itemIndex);
		
		if (e.itemIndex != 2) {
			for (var key in data) {
				details.push({title: data[key].label, subtitle: data[key].count + " players"});
			}
		} else {
			for (var key2 in data) {
				if (key2 != "status")
					details.push({title: key2, subtitle: data[key2] + " players"});
			}
		}
		
		detailView = new UI.Menu({
			backgroundColor: 'black',
			textColor: 'orange',
			highlightBackgroundColor: 'orange',
			highlightTextColor: 'black',
			sections: [{
				title: e.item.title,
				items: details
			}]
		});

		detailView.show();
		var event = e;
		
		detailView.on('accelTap', function(e){
			detailView.hide();
			getDetailView(event);
		});
		
	}, function(error) {
		console.log('Failed fetching stats data: ' + error);
		var errorScreen = new UI.Card({ title: 'Error', subtitle: 'Loading statistics fail :(' });
		errorScreen.show();
	});
}