<template>
  <div class="statik">
    <h1>Statik</h1>
    <p>{{ count }}</p>
 
    <p>så skal der regnes</p>
    
    <lastfordeling></lastfordeling>
    <snitkraft></snitkraft>
    <bezier></bezier>
  </div>
</template>

<script>
// @ is an alias to /src
import bezier from "@/components/Bezier.vue"
import lastfordeling from "@/components/Lastfordeling.vue"
import snitkraft from "@/components/Snitkraft.vue"
import store from "@/store"

import * as math from "mathjs"

export default {
  name: "statik",
  components: {
    bezier,
    lastfordeling,
    snitkraft,
  },
  data: function() {
    return {};
  },
  computed: {
    count () {
	    return store.state.count
    }
  },
  methods: {
   
  }
};
</script>