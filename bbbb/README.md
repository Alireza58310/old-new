# BPB + Zeus (D1)

BPB Panel v5.1.1 with D1 storage (binding `DB`), updates disabled, multi-country (IATA) lock,
clean IPs from Ip.txt and a Zeus settings page at `/{securePath}/zeus`.

- `worker.js`  - the finished worker. The wizard downloads this file.
- `zeus-build/` - sources and build script:
  `python3 zeus-build/build.py <original-bpb-v5.1.1-worker.js> worker.js`   (`--readable` keeps add-ons unminified)
- `zeus-build/tests/run.sh` - tests with fake D1 + fake network (node 22).
