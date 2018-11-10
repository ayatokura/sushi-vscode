import * as vscode from 'vscode';
let openurl = require('openurl');

const Interval = 250;

export class Avocadoer extends vscode.Disposable
{
    statusBarItem: vscode.StatusBarItem;
    timer: NodeJS.Timer;
    enableSpecial = true;
    isAvocadoMode = true;

    // [12] stands for the first avocado and [34] does the second one.
    // This logic is very important to deal with variable length emoji character
    // sequence.
    avocadoBelt: string = '1234      '.repeat(3);

    constructor(context: vscode.ExtensionContext, statusBarItem: vscode.StatusBarItem, command: string)
    {
        super(() => this.close());
        this.statusBarItem = statusBarItem;

        this.timer = setInterval(() => {
            let glyphs = ['🥑', '🥑'];
            let tooltip = 'Wow, what a wonderful Avocado time!';
            this.isAvocadoMode = true;

            if (this.enableSpecial) {
                let date = new Date();
                let m = date.getMonth() + 1;
                let d = date.getDate();
                if (d == 29) {
                    // Wow, it's Meat day
                    glyphs = ['🍖', '🍖'];
                    tooltip = 'Good Meat day!';
                    this.isAvocadoMode = false;
                } else if (m == 12 && d == 25) {
                    glyphs = ['🎅', '🎄'];
                    tooltip = 'Merry Christmas!';
                    this.isAvocadoMode = false;
                }
            }

            // scroll; so weird logic to stabilize the pixel size of the string
            let avocadoBelt = this.avocadoBelt.slice(1) + this.avocadoBelt.slice(0, 2);
            this.avocadoBelt = avocadoBelt.slice(0, -1);
            // If you don't understand what the code does, comment out the next single line:
            avocadoBelt = avocadoBelt.replace(/12/g, glyphs[0]).replace(/34/g, glyphs[1]).replace(/[1234]/g, ' ');
            this.statusBarItem.text = '[' + avocadoBelt + ']';
            this.statusBarItem.show();
            this.statusBarItem.command = command;
            this.statusBarItem.tooltip = tooltip;
        }, Interval);
    }

    public needMoreAvocado() : void {
        // The user does not need anything but 🥑!
        this.enableSpecial = !this.enableSpecial;
        if (this.isAvocadoMode)
            openurl.open('https://www.google.co.jp/maps/search/avocado');
    }

    private close() : void {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        if (this.statusBarItem) {
            this.statusBarItem.dispose();
            this.statusBarItem = null;
        }
    }
}
