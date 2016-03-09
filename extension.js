// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var Firebase = require('firebase');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hackernews" is now active!'); 
    //Firebase HackerNews top stories
    var myFirebaseRef = new Firebase("https://hacker-news.firebaseio.com/v0");

    myFirebaseRef.child("topstories").on("value", function(snapshot) {
        console.log(snapshot.val());
        snapshot.val().forEach(function(element) {
            var itemValue = "item/" + element;
            myFirebaseRef.child(itemValue).on("value", function(snapshot) {
                console.log(snapshot.val());  
            });
        }, this);
    });

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	var disposable = vscode.commands.registerCommand('extension.sayHello', function () {
		// The code you place here will be executed every time your command is executed
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        var selection = editor.selection;
        var text = editor.document.getText(selection);

        // Display a message box to the user
        vscode.window.showInformationMessage('Selected characters: ' + text.length);
        
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
        
        
        //https://hacker-news.firebaseio.com/v0/topstories.json
	});
	
	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;