
var Tests = module.exports,
    AhoCorasick = require('..');


Tests['Test simple'] = function(test) {

   var trie = new AhoCorasick.TrieNode();

   ['ab', 'bcr', 'caa'].forEach(function(word) { trie.add(word, { word: word }); });

   AhoCorasick.add_suffix_links(trie);

   AhoCorasick.search('foab', trie, function(found_word, data) {
      test.equal(found_word, 'ab');
      test.equal(data.word, 'ab');
   });

   AhoCorasick.search('bcaa', trie, function(found_word, data) {
      test.equal(found_word, 'caa');
      test.equal(data.word, 'caa');
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
