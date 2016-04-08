// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var Firebase = require('firebase');
var json2html = require('node-json2html');
var moment = require('moment');
const api = new Firebase('https://hacker-news.firebaseio.com/v0')

var topStories = []; 

function load() {
    loadTopStories(print);
}

function loadTopStories(callback) {
    api.child('topstories').on('value', snapshot => {
        topStoryIds = snapshot.val();
        callback(print_stories); 
    })
    
}

function print(callback) {
    for(var i = 0; i < topStoryIds.length; i++){
        api.child('item/' + topStoryIds[i]).once('value', snapshot => {
            callback(snapshot.val());
        })
    }
}

function print_stories(data) {
    var transform = {"tag":"div","children":[{"tag":"a","href":"${url}","html":"${title}"}]};
     const docProvider = {
                     provideTextDocumentContent: () => json2html.transform(data,transform)
                 };

     vscode.workspace.registerTextDocumentContentProvider('hackernews', docProvider);
     vscode.commands.executeCommand("vscode.previewHtml",
             vscode.Uri.parse("hackernews://base"), vscode.ViewColumn.One)
             .then(() => 1, error => console.log(error));
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
	var disposable = vscode.commands.registerCommand('hackernews.topstories', load);
	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;