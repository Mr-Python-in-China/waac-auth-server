cd app/;
if [ ! -f .initialized ]; then
  npm install && \
  npx prisma migrate deploy && \
  npx prisma generate && \
  npm run build && \
  touch .initialized
  if [ ! -f .initialized ]; then
    echo "Compilation failed, exiting..." >&2
    exit 2
  fi
fi
npm run start;
