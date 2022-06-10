#!/usr/bin/env node

const { version } = require('../package.json');
const { readdir } = require('fs').promises;
const readline = require('readline');

const oneDriveRegex = /^\d{2}-\d{2}-\d{4}_\d{2}-\d{2}-\d{2}-\w*.\w{3}$/;
const extStorageRegex = /^[\w\s]*\d{4}-\d{2}-\d{2}\s\d{2}-\d{2}-\d{2}.\w{3}$$/

console.log(`\nXbox Captures Renamer v${version}`);

function convertedOneDriveFilename(filename) {
    const convertedDate = filename.slice(0, 10).split('-').reverse().join('-');
    const convertedTime = filename.slice(11, 19);
    const comment = filename.slice(20, 28);
    const extension = filename.slice(-3);
    return `${convertedDate}T${convertedTime} - ${comment}.${extension}`;
};

function convertedExtStorageFilename(filename) {
    const extension = filename.slice(-3);
    const convertedTime = filename.slice(-12, -4);
    const convertedDate = filename.slice(-23, -13)
    const comment = filename.slice(0, -24);
    return `${convertedDate}T${convertedTime} - ${comment}.${extension}`;
};

async function getFiles() {

    try {
        const files = await readdir(process.cwd());
        const oneDriveFiles = files.filter(filename => filename.match(oneDriveRegex));
        const extStorageFiles = files.filter(filename => filename.match(extStorageRegex));
        const ignoredFiles = files
            .filter(filename => !oneDriveFiles.includes(filename))
            .filter(filename => !extStorageFiles.includes(filename));


        console.log(`\nFiles found in "${process.cwd()}":`)
        console.table({
            "OneDrive": oneDriveFiles.length,
            "External": extStorageFiles.length,
            "Ignored": ignoredFiles.length,
            "Total": files.length,
        });

        if (ignoredFiles.length) {
            console.log('\nIgnored files:');
            ignoredFiles.forEach(filename => console.log(`"${filename}"`))
        }

        if(extStorageFiles.length) {
            console.log('\nNew names for external storage captures:');
            extStorageFiles.forEach(filename => console.log(`"${filename}" -> "${convertedExtStorageFilename(filename)}"`));
        };

        if (oneDriveFiles.length) {
            console.log('\nNew names for OneDrive downloads:');
            oneDriveFiles.forEach(filename => console.log(`"${filename}" -> "${convertedOneDriveFilename(filename)}"`));
        };

    } catch (err) {
        console.error('Unable to find files:', err);
    };
};

async function main() {
    const interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    await getFiles();

    interface.question('\nDo you wish to continue? [y/N]: ', response => {
        if (!response || response.toLowerCase() !== 'y') {
            console.log('No, end.');
            interface.close();
            process.exit(0);
        };

        if (response.toLowerCase() === 'y') {
            console.log('Continuing...');
        };
    });
};

main();
