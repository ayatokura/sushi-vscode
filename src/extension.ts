'use strict';
import * as vscode from 'vscode';
import { Avocadoer } from './🥑erToolBarItem';

let avocadoer: Avocadoer;

function getAvocado(context: vscode.ExtensionContext) : Avocadoer {
    if (!avocadoer)
        avocadoer = new Avocadoer(context, vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1000), 'extension.needMoreAvocado');
    return avocadoer;
}

export function activate(context: vscode.ExtensionContext) {

    interface Commands {
        id: string;
        command: (context: vscode.ExtensionContext) => any;
    }
    let commands: Commands[] = [
        {
            id: 'extension.avocadoOnStatusBar',
            command: () => getAvocado(context)
        },
        {
            id: 'extension.needMoreAvocado',
            command: () => getAvocado(context).needMoreAvocado()
        }
    ];

    commands.forEach(cmd => {
        context.subscriptions.push(vscode.commands.registerCommand(cmd.id, cmd.command));
    });
}

export function deactivate() {
    if (avocadoer) {
        avocadoer.dispose();
        avocadoer = null;
    }
}