

About [![Build Status](https://travis-ci.org/tombooth/aho-corasick.js.png?branch=master)](https://travis-ci.org/tombooth/aho-corasick.js)
-------------------------------------
A Javascript implementation of the [Aho-Corasick algorithm](http://cisc-w09.isrl.kr/cgi-bin/TUBoard/db/seminar/upload/1183356194165246034173/p333-aho-corasick.pdf). It has one difference in that it will return the longest possible match.

Installation
-------------------------------------
```
$ npm install aho-corasick.js
```

Usage
-------------------------------------
```javascript
var AhoCorasick = require('aho-corasick.js'),
    trie = new AhoCorasick.TrieNode();

['ab', 'bcr', 'caa'].forEach(function(word) { trie.add(word, { word: word }); });

AhoCorasick.add_suffix_links(trie);

AhoCorasick.search('foab', trie, function(found_word, data) {
   console.log(found_word, data);
});
```

Links
-------------------------------------
Coffeescript port by @hsujian https://github.com/hsujian/aho-corasick





