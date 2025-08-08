use std::{env, error, fs, path::Path};
use ts_rs::TS;
mod user;

fn generate_types() -> Result<(), Box<dyn error::Error>> {
    let out_dir = "generated-types";
    let dir_path = Path::new(env::var("CARGO_MANIFEST_DIR")?.as_str()).join(out_dir);

    if dir_path.exists() {
        fs::remove_dir_all(&dir_path)?;
    }

    fs::create_dir_all(&dir_path)?;

    user::User::export_all_to("generated-types")?;

    Ok(())
}

fn main() {
    generate_types().unwrap();
}
