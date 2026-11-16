/**
 * Building icons and their fixed colors, centralized so every usage stays
 * consistent. Add a new icon here once and reference it by building id —
 * no need to remember to color-code it at each call site.
 */

import barbellIcon from "@tabler/icons/filled/barbell.svg?raw";
import diceIcon from "@tabler/icons/filled/dice-5.svg?raw";
import basketIcon from "@tabler/icons/filled/basket.svg?raw";
import tvIcon from "@tabler/icons/filled/device-tv.svg?raw";
import elevatorIcon from "@tabler/icons/filled/elevator.svg?raw";
import tagIcon from "@tabler/icons/filled/tag.svg?raw";
import satelliteIcon from "@tabler/icons/filled/satellite.svg?raw";
import busIcon from "@tabler/icons/filled/bus.svg?raw";
import flameIcon from "@tabler/icons/filled/flame.svg?raw";
import videoIcon from "@tabler/icons/filled/video.svg?raw";
import moodAngryIcon from "@tabler/icons/filled/mood-angry.svg?raw";
import messagesIcon from "@tabler/icons/filled/messages.svg?raw";
import bellRingingIcon from "@tabler/icons/filled/bell-ringing.svg?raw";
import brandTiktokIcon from "@tabler/icons/filled/brand-tiktok.svg?raw";
import phoneCallingIcon from "@tabler/icons/filled/phone-calling.svg?raw";
import handFingerIcon from "@tabler/icons/outline/hand-finger.svg?raw";
import handTwoFingersIcon from "@tabler/icons/outline/hand-two-fingers.svg?raw";
import shoeIcon from "@tabler/icons/outline/shoe.svg?raw";

import type { BuildingId, ClickUpgradeId } from "./types";

export interface IconDef {
	svg: string;
	color: string;
}

export const ICONS: Record<BuildingId, IconDef> = {
	gym: { svg: barbellIcon, color: "#ef5350" },
	bingo: { svg: diceIcon, color: "#ab47bc" },
	market: { svg: basketIcon, color: "#66bb6a" },
	tv: { svg: tvIcon, color: "#42a5f5" },
	lift: { svg: elevatorIcon, color: "#ffca28" },
	olx: { svg: tagIcon, color: "#ff7043" },
	antenna: { svg: satelliteIcon, color: "#26c6da" },
	bus: { svg: busIcon, color: "#8d6e63" },
};

export const CLICK_UPGRADE_ICONS: Record<ClickUpgradeId, IconDef> = {
	slap: { svg: handFingerIcon, color: "#ef5350" },
	palmadubla: { svg: handTwoFingersIcon, color: "#ec407a" },
	papuc: { svg: shoeIcon, color: "#ffa726" },
	roastlegend: { svg: flameIcon, color: "#f5c542" },
	apelvideo: { svg: videoIcon, color: "#42a5f5" },
	curea: { svg: moodAngryIcon, color: "#8d6e63" },
	barfa: { svg: messagesIcon, color: "#ab47bc" },
	scandal: { svg: bellRingingIcon, color: "#ff7043" },
	tiktok: { svg: brandTiktokIcon, color: "#26c6da" },
	apel3: { svg: phoneCallingIcon, color: "#66bb6a" },
};
