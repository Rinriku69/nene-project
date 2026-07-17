export interface StardewSaveResource {
  id:number;
  farm_name: string;
  game_version: string;
  mod_version: string;
  day: number;
  season: string;
  year: number;
  money: number;
  total_money_earned: number;
  players: StardewPlayerResource[];
}

export interface StardewPlayerResource {
  player_id: number;
  farmer_name: string;
  is_host: boolean;
  sent_at: string;
  play_time: number;
  avatar_url:string;
  skill: StardewPlayerSkill;
  stat: StardewPlayerStat;
}

export interface StardewPlayerSkill {
  farming: number;
  mining: number;
  foraging: number;
  fishing: number;
  combat: number;
}

export interface StardewPlayerStat {
  items_crafted: number;
  items_cooked: number;
  fish_caught: number;
  monsters_killed: number;
}
