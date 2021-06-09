FROM fusuf/whatsasena:latest

RUN git clone https://github.com/wrestling1/WhatsAsenaDuplicated.git /root/WhatsAsenaDuplicated
WORKDIR /root/WhatsAsenaDuplicated/
ENV REPO="https://abdurehmanoff/WhatsAsenaDuplicated"
ENV TZ=Europe/Istanbul

RUN npm install supervisor -g
RUN yarn install --no-audit

CMD ["run.sh"]
