/**
 * Renders a list of team members with their roles and avatars
 */
const TeamMembersList = ({ members, onRemoveMember }) => {
  return (
    <>
      {members.map((member) => (
        <MenuItem
          key={member.user_id}
          sx={{
            py: 1,
            "&:hover": {
              bgcolor: "rgba(157, 78, 221, 0.1)",
            },
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#3C096C",
                fontSize: "0.875rem",
              }}
            >
              {member.User?.name?.charAt(0) || member.User?.username?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2">
                {member.User?.name || member.User?.username}
              </Typography>
            </Box>
            {member.role === "admin" && <Crown size={16} color="#fbbf24" />}
          </Stack>
        </MenuItem>
      ))}
    </>
  );
};
