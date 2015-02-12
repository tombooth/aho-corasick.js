
var Tests = module.exports,
    AhoCorasick = require('..');


Tests['Test simple'] = function(test) {

   var trie = new AhoCorasick.TrieNode();

   ['ab', 'bcr', 'caa'].forEach(function(word) { trie.add(word, { word: word }); });

   AhoCorasick.add_suffix_links(trie);

   AhoCorasick.search('foab', trie, function(found_word, data) {
      test.equal(found_word, 'ab');
      test.equal(data[0].word, 'ab');
   });

   AhoCorasick.search('bcaa', trie, function(found_word, data) {
      test.equal(found_word, 'caa');
      test.equal(data[0].word, 'caa');
   });

   test.expect(4);
   test.done();
};

Tests['Picks out multiple words'] = function(test) {

   var trie = new AhoCorasick.TrieNode();

   ['little bit of', 'receivings', 'ivi', 'boot', 'here'].forEach(function(word) { trie.add(word); });

   AhoCorasick.add_suffix_links(trie);

   var find_list = ['here', 'little bit of', 'ivi', 'boot']
       i = 0;

   AhoCorasick.search('here is a little bit of text that more closely resembles the kind of style that this library will be receiving. maybe with another sentance one to boot', trie, function(found_word) {

      test.equal(found_word, find_list[i++]);

   });

   test.expect(find_list.length);
   test.done();
};

Tests['Match longest'] = function(test) {

   var trie = new AhoCorasick.TrieNode();

   ['foo', 'foo bar'].forEach(function(word) { trie.add(word); });

   AhoCorasick.add_suffix_links(trie);

   AhoCorasick.search('foo', trie, function(found_word, data) {
      test.equal(found_word, 'foo');
   });

   AhoCorasick.search('foo bar', trie, function(found_word, data) {
      test.equal(found_word, 'foo bar');
   });

   test.expect(2);
   test.done();
};

Tests['Allow attaching multiple bits of data'] = function(test) {

   var trie = new AhoCorasick.TrieNode();

   trie.add('foo', 'data1');
   trie.add('foo', 'data2');

   AhoCorasick.add_suffix_links(trie);

   AhoCorasick.search('foo', trie, function(found_word, data) {
      test.equal(data[0], 'data1');
      test.equal(data[1], 'data2');
   });

   test.expect(2);
   test.done();
};


Tests['Match full_word only'] = function(test) {

   var trie = new AhoCorasick.TrieNode();

   ['foo', 'bar'].forEach(function(word) { trie.add(word, { word: word } ); });

   AhoCorasick.search('fooz are bar ', trie, {full_word:true}, function(found_word, data) {
      test.equal(data[0].word, 'bar');
   });

   test.expect(1);
   test.done();
}

Tests['Search Sync'] = function(test) {

   var trie = new AhoCorasick.TrieNode();

   ["paris", "paris hilton"].forEach(function(word) { trie.add(word, true); });
   //"paris hilton" =[paris, paris hilton] -> [paris hilton]
   //"in paris with paris hilton" =[paris, paris hilton] -> [paris hilton]
   var results=AhoCorasick.searchSync("he is with paris hilton", trie)
   test.equal(results[0][0], "paris hilton")
   test.equal(results[1], undefined)

   var results=AhoCorasick.searchSync("he is in paris with paris hilton", trie)
   test.equal(results[0][0], "paris")
   test.equal(results[1][0], "paris hilton")
   test.equal(results[2], undefined)

   var results=AhoCorasick.searchSync("he is in parisz with paris hilton", trie, {full_word:true})
   test.equal(results[0][0], "paris hilton")
   test.equal(results[1], undefined)

   var results=AhoCorasick.searchSync("he is with paris hiltong", trie, {full_word:true})
   test.equal(results[0][0], "paris")
   test.equal(results[1], undefined)

   test.expect(9);
   test.done();
}