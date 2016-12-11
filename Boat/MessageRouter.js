const EventEmitter = require('events');

const EVENT_TYPES = [
  "message",
  "edited_message",
  "channel_post",
  "edited_channel_post",
  "inline_query",
  "chosen_inline_result",
  "callback_query"
];

const MESSAGE_SUB_TYPES = [
  "text",
  "entities",
  "audio",
  "document",
  "game",
  "photo",
  "sticker",
  "video",
  "voice",
  "caption",
  "contact",
  "location",
  "venue",
  "new_chat_member",
  "left_chat_member",
  "new_chat_title",
  "new_chat_photo",
  "delete_chat_photo",
  "group_chat_created",
  "migrate_to_chat_id",
  "migrate_from_chat_id",
  "pinned_message"
];

class MessageRouter extends EventEmitter {
  constructor(source){
    super();
    this.source = source;
    source.on("message",message=>{
      const subType = MESSAGE_SUB_TYPES.find(n=>n in message);
      this.emit(subType,message);
    });
    EVENT_TYPES.forEach(eventType=>
      source.on(eventType,message=>
        this.emit(eventType,message)
      )
    );
  }
}

module.exports = MessageRouter;
