# redactXRNS

A simple Vue app that clears paths contained in Renoise .xrns project files.

For example:

```
//File:C:\Users\<your_user>\Documents\totally_not_suspicious_foldername\sample.wav
```

This tool replaces those paths with

```
//File:REDACTED\sample.wav
```

As simple as that.

## Running offline

Install [node.js](https://nodejs.org/). Most modern Linux distributions ship with it.

Then simply clone the repository, open the root folder on terminal and run `npm install`

```sh
cd <repository location>
npm install

```

After installing, use the following command. It will give you a local url you can use to access the tool in your browser:

```sh
npm run dev
```

## License

DWTFYW (Do Whatever The Fuck You Want) License. Quite self-explanatory. (I just made that up)
