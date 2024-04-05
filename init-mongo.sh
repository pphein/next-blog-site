#!/bin/bash

mongo admin --host localhost -u "root" -p "admin123" --authenticationDatabase admin <<EOF
use my_database
db.createCollection("my_collection")
db.createUser({
  user: "my_user",
  pwd: "my_password",
  roles: [{ role: "readWrite", db: "my_database" }]
})
EOF