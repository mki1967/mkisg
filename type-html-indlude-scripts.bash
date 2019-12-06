ls -1 js/*.js | { while read A; do echo '<script src="'$A'"></script>'; done;  }

