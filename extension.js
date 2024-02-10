import * as MessageTray from 'resource:///org/gnome/shell/ui/messageTray.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import Gio from "gi://Gio";

const iconMap = {
    0: "colorful",
    1: "white",
    2: "black",
    3: "grey"
}

export default class Slacker extends Extension {
    constructor(metadata) {
        super(metadata);
    }

    enable() {
        const settings = this.getSettings();
        const path = this.metadata.path;
        MessageTray.MessageTray.prototype._updateStateOriginal = MessageTray.MessageTray.prototype._updateState;
        MessageTray.MessageTray.prototype._updateState = function() {
            customUpdateState(this, settings, path);
        };
    }

    disable() {
        MessageTray.MessageTray.prototype._updateState = MessageTray.MessageTray.prototype._updateStateOriginal;
        delete MessageTray.MessageTray.prototype._updateStateOriginal;
    }
}

let customUpdateState = function(context, settings, path) {
    context._notificationQueue = context._notificationQueue.filter((notification) => {
        if (notification.bannerBodyText.includes("app.slack.com")) {
            let iconName = iconMap[settings.get_int("icon-name")];
            let urgencyLevel = settings.get_int("urgency-level");
            let transientMode = settings.get_boolean("transient-mode");

            let title = notification.title;
            let message = notification.bannerBodyText.replace(/\s*app\.slack\.com\s*/, "");
            let icon = Gio.Icon.new_for_string(`${path}/icons/${iconName}.png`);

            notification.update(title, message, { gicon: icon, clear: true });
            notification.setUrgency(urgencyLevel);
            notification.setTransient(transientMode);
        }
        return true
    });
    context._updateStateOriginal();
}
