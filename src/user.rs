use ts_rs::TS;

#[derive(TS)]
#[ts(export)]
pub struct User {
    user_id: i32,
    first_name: String,
    last_name: String,
}
