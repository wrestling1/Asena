FROM fusuf/whatsasena:latest

RUN git clone https://github.com/Furkan92-sudo/asena.git /root/WhatsAsenaDuplicated
WORKDIR /root/WhatsAsenaDuplicated/
ENV REPO="https://github.com/Furkan92-sudo/asena"
ENV TZ=Europe/Istanbul

RUN npm install supervisor -g
RUN yarn install --no-audit

CMD ["run.sh"]
