
var AhoCorasick = { };

(function(AhoCorasick) {


   function TrieNode() {

      this.suffix = { };
      this.is_word = null;
      this.value = null;
      this.data = [ ];

   }

   TrieNode.prototype.add = function(word, data, original_word) {

      var chr = word.charAt(0),
          node = this.suffix[chr];

      if (!node) {
         node = this.suffix[chr] = new TrieNode();

         if (original_word) node.value = original_word.substr(0, original_word.length - word.length + 1);
         else node.value = chr;
      }

      if (word.length > 1) node.add(word.substring(1), data, original_word || word);
      else {
         node.data.push(data);
         node.is_word = true;
      }

   };

   TrieNode.prototype.find = function(word) {

      var suffix_node;

      if (word.length === 0 || this.is_word) return this;
      else {

         suffix_node = this.suffix[word.charAt(0)];

         return suffix_node ? suffix_node.find(word.substring(1)) : null;

      }

   };

   TrieNode.prototype.print = function(prefix) {

      var current = this,
          suffixes = Object.keys(this.suffix),
          out = this.value ? this.value : '(base)';

      if (this.is_word) out = '[' + out + ']';
      if (prefix) out = prefix + out;

      console.log(out);

      if (this.suffix_link) console.log(out + ' <- ' + this.suffix_link.value + ' [' + this.suffix_offset + ']');

      for (var i = 0, len = suffixes.length; i < len; i++) {
         this.suffix[suffixes[i]].print(out + ' -> ');
      }

   };



   AhoCorasick.TrieNode = TrieNode;




   AhoCorasick.add_suffix_links = function(node, trie) {

      var suffixes = Object.keys(node.suffix),
          link_node;

      trie = trie || node;

      node.suffix_link = null;
      node.suffix_offset = 0;

      if (node.value) {
         for (var i = 1, len = node.value.length; i < len && !link_node; i++) {
            link_node = trie.find(node.value.substring(i));
         }

         if (link_node) {
            node.suffix_link = link_node;
            node.suffix_offset = node.value.length - (node.value.lastIndexOf(link_node.value) + link_node.value.length);
         }
      }

      for (i = 0, len = suffixes.length; i < len; i++) {
         AhoCorasick.add_suffix_links(node.suffix[suffixes[i]], trie);
      }

   };


   AhoCorasick.searchSync = function(string, main_trie, options) {
      options= options||{};
      var current_trie= main_trie;
      var results=[];
      var chr, next_chr;
      var dead_word=false;
      var i=0;
      if(typeof string!="string"){
         return []
      }
      //every char in the string
      while(i<=string.length){
        chr=string.charAt(i);
        //update to trie to next character.
        if(current_trie){
          current_trie= current_trie.suffix[chr]
        }
         //try to end now..
        if(current_trie && current_trie.is_word){//this is maybe done now

          if(!options.full_word){
            results.push([current_trie.value, current_trie.data])
          }else{
            //it requires the next character is a word boundary
            next_chr= string.charAt(i+1)
            //ensure that next_chr is a space or something..
            if(next_chr=="" || next_chr.match(/[^a-zA-Z0-9]/i) ){
              results.push([current_trie.value, current_trie.data])
            }
          }

        }
       //a new word is a new begining..
       if(!current_trie && chr.match(/[^a-zA-Z0-9]/i)){
          current_trie= main_trie
       }
       i=i+1
      }
      //remove 'paris' from 'paris hilton'
      results=results.filter(function(a,i){
         if(results[i+1] && results[i+1][0].match(a[0]) && results[i+1][0]!=a[0]){
            return false
         }
         return true
      })
      return results
   }


   AhoCorasick.search = function(string, trie, options, callback) {
      //allow lazy options paramater
      if(typeof options=="function"){
         callback= options;
      }
      options= options||{};
      var current = trie,
          chr, next;

      for (var i = 0, len = string.length; i <= len; i++) {

         chr = string.charAt(i);
         next = current.suffix[chr];


         if (next) {
            current = next;
         }
         else {
            //it found something..
            if (callback && current && current.is_word){
               //ensure the next char is a word-boundary
               if(options.full_word){
                  if(chr === '' || chr.match(/[a-zA-Z0-9]/i) === null ){
                     callback(current.value, current.data);
                  }
               }else{
                 callback(current.value, current.data);
              }
            }

            if (current.suffix_link) {
               i = i - (current.suffix_offset + 1);
               current = current.suffix_link;
            }
            else {
               current = trie;
            }

         }

      }

   };


}(AhoCorasick));

if(module) module.exports = AhoCorasick;
else window.AhoCorasick = AhoCorasick;

