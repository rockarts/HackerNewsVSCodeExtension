// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var Firebase = require('firebase');

//this.statusBarItemMain = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 6);
//this.statusBarItemMain.text = '$(home) Hacker News'
//this.statusBarItemMain.tooltip = 'HackerNews Top Stories';
//this.statusBarItemMain.command = 'hackernews.topstories';
//this.statusBarItemMain.show();

function loadTopStories() {

    var myFirebaseRef = new Firebase("https://hacker-news.firebaseio.com/v0");
    var html = "<html><body>";
    myFirebaseRef.child("topstories").on("value", function(snapshot) {
        snapshot.val().forEach(function(element) {
            var itemValue = "item/" + element;
            myFirebaseRef.child(itemValue).on("value", function(snapshot) {
                var json2html = require('node-json2html');
                var transform = {"tag":"div","children":[{"tag":"a","href":"${url}","html":"${title}"}]}
                var data = snapshot.val();
                const docProvider = {
                    provideTextDocumentContent: () => json2html.transform(data,transform)
                };
                console.log(json2html.transform(data,transform) );
                vscode.workspace.registerTextDocumentContentProvider('hackernews', docProvider);
                vscode.commands.executeCommand("vscode.previewHtml",
                        vscode.Uri.parse("hackernews://base"), vscode.ViewColumn.One)
                        .then(() => 1, error => console.log(error));

//LivingSocial Is Laying Off More Than 50 Percent of Its Staff (recode.net)
//31 points by danso 37 minutes ago | 12 comments

            });
        }, this);
    });
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hackernews" is now active!'); 
    
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	var disposable = vscode.commands.registerCommand('hackernews.topstories', loadTopStories);
	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;