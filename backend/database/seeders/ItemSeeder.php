<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('items')->insert([
            ['name'=>'Saa, kakegurui mashou','description'=>'Nene in Saa, kakegurui mashou pose! ','rarity'=>'R','url'=>'https://res.cloudinary.com/dhvmcbbdi/image/upload/q_auto/f_auto/v1780825449/134202223707051303_1452_817_1780434406103_-_Copy_b1m6qy.jpg','weight'=>3,'created_at'=>now(),'updated_at'=>now()],
            ['name'=>'Oam got my head','description'=>'Alien Aom try to steal Mheepooh!','rarity'=>'N','url'=>'https://res.cloudinary.com/dhvmcbbdi/image/upload/q_auto/f_auto/v1780825442/134202354287274718_1452_817_1777147046254_hoj2eq.jpg','weight'=>4,'created_at'=>now(),'updated_at'=>now()],
            ['name'=>'ANP','description'=>'Triple Little Cat OwO','rarity'=>'N','url'=>'https://res.cloudinary.com/dhvmcbbdi/image/upload/q_auto/f_auto/v1780825390/134224687394682974_1452_817_1780434126139_if4d0i.jpg','weight'=>3,'created_at'=>now(),'updated_at'=>now()],
            ['name'=>'PN Beach','description'=>'Nene and Mheepooh Beach Pic','rarity'=>'R','url'=>'https://res.cloudinary.com/dhvmcbbdi/image/upload/q_auto/f_auto/v1780825376/IMG_0635_qq33k6.jpg','weight'=>2,'created_at'=>now(),'updated_at'=>now()],
            ['name'=>'PNT SongKarn','description'=>'SongKarn Dance, Dance','rarity'=>'N','url'=>'https://res.cloudinary.com/dhvmcbbdi/image/upload/q_auto/f_auto/v1780825248/134204085521256621_1452_817_1780434340124_-_Copy_ryht65.jpg','weight'=>4,'created_at'=>now(),'updated_at'=>now()],
            ['name'=>'Nene With a shotgun','description'=>'Nene With a shotgun, When peace is not the only way!','rarity'=>'R','url'=>'https://res.cloudinary.com/dhvmcbbdi/image/upload/q_auto/f_auto/v1780825233/134202317523769175_1452_817_1777147052137_svw0sk.jpg','weight'=>2,'created_at'=>now(),'updated_at'=>now()],
            ['name'=>'Nene Nerd pose','description'=>'Did you say GAY?, What?! Where?','rarity'=>'R','url'=>'https://res.cloudinary.com/dhvmcbbdi/image/upload/q_auto/f_auto/v1780825193/134201183503778849_1452_817_1777147104124_gg82zz.jpg','weight'=>1,'created_at'=>now(),'updated_at'=>now()],
            ['name'=>'Black Nene','description'=>'Black Nene','rarity'=>'N','url'=>'https://res.cloudinary.com/dhvmcbbdi/image/upload/q_auto/f_auto/v1780825171/134199699026044338_1452_817_1780434456912_-_Copy_xixv4w.jpg','weight'=>3,'created_at'=>now(),'updated_at'=>now()],
            ['name'=>'Dont mess with ma GANG','description'=>'Super Eor GANG!!','rarity'=>'SSR','url'=>'https://res.cloudinary.com/dhvmcbbdi/image/upload/q_auto/f_auto/v1780825147/IMG_2315_emyyso.jpg','weight'=>3,'created_at'=>now(),'updated_at'=>now()],
            ['name'=>'Nene Flowe','description'=>'Hi there, I am Nene Flower','rarity'=>'SR','url'=>'https://res.cloudinary.com/dhvmcbbdi/image/upload/q_auto/f_auto/v1780825123/134227912693387031_1452_817_1780434105773_d4iyrq.jpg','weight'=>3,'created_at'=>now(),'updated_at'=>now()],
            ['name'=>'Angry Nene','description'=>'Who stole my ไข่ตุ๋น >:(','rarity'=>'R','url'=>'https://res.cloudinary.com/dhvmcbbdi/image/upload/q_auto/f_auto/v1780825123/134228013335366685_1452_817_1780434073833_vuboby.jpg','weight'=>1,'created_at'=>now(),'updated_at'=>now()],
            ['name'=>'First day, First time','description'=>'The day, where it all started','rarity'=>'SSR','url'=>'https://res.cloudinary.com/dhvmcbbdi/image/upload/q_auto/f_auto/v1780825122/134229904285196146_1452_817_1780434049335_klt8w1.jpg','weight'=>1,'created_at'=>now(),'updated_at'=>now()],
            ['name'=>'Nene tale','description'=>'Princess Nene','rarity'=>'N','url'=>'https://res.cloudinary.com/dhvmcbbdi/image/upload/q_auto/f_auto/v1780825122/134215114489764490_1452_817_1780434219032_lir4w8.jpg','weight'=>1,'created_at'=>now(),'updated_at'=>now()],
            ['name'=>'Nene SUper Cute','description'=>'-9999 DAMAGE!!!','rarity'=>'SR','url'=>'https://res.cloudinary.com/dhvmcbbdi/image/upload/q_auto/f_auto/v1780825122/134221117877218805_1452_817_1777665195815_ihzbww.jpg','weight'=>2,'created_at'=>now(),'updated_at'=>now()],
            ['name'=>'Nene Dance','description'=>'Its show time!','rarity'=>'N','url'=>'https://res.cloudinary.com/dhvmcbbdi/image/upload/q_auto/f_auto/v1780825122/134202223657070124_1452_817_1777147072677_de2kwi.jpg','weight'=>4,'created_at'=>now(),'updated_at'=>now()],
            ['name'=>'Nene with bear','description'=>'Nene with bear','rarity'=>'SR','url'=>'https://res.cloudinary.com/dhvmcbbdi/image/upload/q_auto/f_auto/v1780825122/134214350439746815_1452_817_1777146706380_nr4dqe.jpg','weight'=>1,'created_at'=>now(),'updated_at'=>now()],
        ]);
    }
}   
