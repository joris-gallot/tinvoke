use std::path::PathBuf;

pub fn build(dir_path: PathBuf) -> Result<(), Box<dyn std::error::Error>> {
    let typed_file = dir_path.join("tinvoke.d.ts");

    let content = r#"export {};

declare module "tinvoke" {
  export interface RouteMap {}
}
"#;

    std::fs::write(typed_file, content)?;
    Ok(())
}
