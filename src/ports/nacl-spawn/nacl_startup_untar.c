/*
 * Copyright (c) 2014 The Native Client Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

#include "nacl_main.h"

#include <assert.h>
#include <fcntl.h>
#include <libtar.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>


int nacl_startup_untar(
    const char *argv0, const char* tarfile, const char* root) {
  int ret;
  TAR* tar;
  char filename[PATH_MAX];
  char* pos;

  // First try relative to argv[0].
  strcpy(filename, argv0);
  pos = strrchr(filename, '/');
  if (pos) {
    pos[1] = '\0';
  } else {
    filename[0] = '\0';
  }
  strcat(filename, tarfile);
  ret = tar_open(&tar, filename, NULL, O_RDONLY, 0, 0);
  if (ret) {
    // Fallback to /mnt/http.
    strcpy(filename, "/mnt/http/");
    strcat(filename, tarfile);
    ret = tar_open(&tar, filename, NULL, O_RDONLY, 0, 0);
    if (ret) {
      fprintf(stderr, "error opening %s\n", filename);
      return 1;
    }
  }

  ret = tar_extract_all(tar, (char*)root);
  if (ret) {
    fprintf(stderr, "error extracting %s\n", filename);
    return 1;
  }

  ret = tar_close(tar);
  assert(ret == 0);
  return 0;
}
