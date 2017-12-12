var categories = {
    "sd": {
      "area": ["urban_area", "tribal_are", "farm_area"],
      "race": ["black_afri", "coloured", "asian", "white", "other_race"],
      "lang": [
        "afrikaans", "english", "isi_ndebele", "isi_xhosa", "isi_zulu", "sepedi", "sesotho", "setswana", "sign_lang", "si_swati", "tshivenda", "xitsonga", "other_lang", "unspec_lan", "na_lang"
      ],
      "edu": ["primary", "secondary", "ntc", "cert_dip", "tertiary", "no_schooli", "other_edu"],
      "age": ["a0_9", "a10_19", "a20_29", "a30_39", "a40_49", "a50_59", "a60_69", "a70_79", "a80_plus"]
    },
    "hh": {
      "income": [
        "no_income", "r1_4800", "r4801_9600", "r9601_1960",  "r19601_382", "r38201_764", "r76401_153", "r153801_30", "r307601_61", "r614401_12", "r1228801_2", "r2457601_pl", "unspec_inc"
      ],
      "type": [
        "brk_hse_sep_s", "traditiona", "flats", "clusters", "townhouses", "semi_det", "backyard", "inf_bckyrd", "informal", "not_sep", "crvn_tent", "other_dwel", "unspec_dwe"
      ]
    }
}

modules.export = {
    categories: categories
}